"use client"

import * as React from "react"

import type { Question, Quiz, QuizIndexEntry, Student } from "@/lib/models"
import { loadPersistedState, persistAllQuizzes, saveQuizIndex, saveStudents } from "@/lib/storage"
import { normalizeStudentName, studentNameKey } from "@/lib/students"

export type PersistedState = {
  students: Student[]
  quizIndex: QuizIndexEntry[]
  quizzes: Record<string, Quiz>
}

export type GeneratorState = {
  usedStudentIds: string[]
  currentStudentId: string | null
}

export type QuizPlayState = {
  selectedQuizId: string | null
  usedQuestionIds: string[]
  usedStudentIds: string[]
  currentQuestionId: string | null
  currentStudentId: string | null
  answerRevealed: boolean
}

export type UIState = {
  quizEditor: {
    activeQuizId: string | null
    editingQuestionId: string | null
  }
  isHydrated: boolean
}

export type AppState = {
  persisted: PersistedState
  domain: {
    generator: GeneratorState
    quizPlay: QuizPlayState
  }
  ui: UIState
}

const initialState: AppState = {
  persisted: {
    students: [],
    quizIndex: [],
    quizzes: {},
  },
  domain: {
    generator: {
      usedStudentIds: [],
      currentStudentId: null,
    },
    quizPlay: {
      selectedQuizId: null,
      usedQuestionIds: [],
      usedStudentIds: [],
      currentQuestionId: null,
      currentStudentId: null,
      answerRevealed: false,
    },
  },
  ui: {
    quizEditor: {
      activeQuizId: null,
      editingQuestionId: null,
    },
    isHydrated: false,
  },
}

type AppAction =
  | { type: "HYDRATE_PERSISTED"; payload: PersistedState }
  | { type: "ADD_STUDENT"; payload: { id: string; name: string } }
  | { type: "TOGGLE_STUDENT_EXCLUDED"; payload: { id: string } }
  | { type: "DELETE_STUDENT"; payload: { id: string } }
  | { type: "CLEAR_STUDENTS" }
  | { type: "UPDATE_STUDENT"; payload: { id: string; name: string } }
  | { type: "RESET_GENERATOR" }
  | { type: "DRAW_STUDENT" }
  | {
      type: "CREATE_QUIZ"
      payload: { id: string; title: string; questions: Question[] }
    }
  | {
      type: "UPDATE_QUIZ"
      payload: { id: string; title: string; questions: Question[] }
    }
  | { type: "DELETE_QUIZ"; payload: { id: string } }
  | { type: "SELECT_QUIZ_FOR_EDITOR"; payload: { id: string | null } }
  | { type: "SET_EDITING_QUESTION"; payload: { id: string | null } }
  | { type: "SELECT_QUIZ_FOR_PLAY"; payload: { id: string | null } }
  | { type: "DRAW_QUIZ_PAIR" }
  | { type: "REVEAL_ANSWER" }
  | { type: "RESET_QUIZ_PLAY" }

const getStudentIdSet = (students: Student[]) =>
  new Set(students.map((student) => student.id))

const pruneGeneratorState = (generator: GeneratorState, students: Student[]) => {
  const studentIds = getStudentIdSet(students)
  const usedStudentIds = generator.usedStudentIds.filter((id) =>
    studentIds.has(id)
  )
  const currentStudentId =
    generator.currentStudentId && studentIds.has(generator.currentStudentId)
      ? generator.currentStudentId
      : null
  return {
    usedStudentIds,
    currentStudentId,
  }
}

const pruneQuizPlayState = (
  quizPlay: QuizPlayState,
  students: Student[],
  quizzes: Record<string, Quiz>
) => {
  const studentIds = getStudentIdSet(students)
  const selectedQuiz = quizPlay.selectedQuizId
    ? quizzes[quizPlay.selectedQuizId]
    : null

  if (!selectedQuiz) {
    return {
      selectedQuizId: null,
      usedQuestionIds: [],
      usedStudentIds: [],
      currentQuestionId: null,
      currentStudentId: null,
      answerRevealed: false,
    }
  }

  const questionIds = new Set(selectedQuiz.questions.map((question) => question.id))
  const usedQuestionIds = quizPlay.usedQuestionIds.filter((id) =>
    questionIds.has(id)
  )
  const usedStudentIds = quizPlay.usedStudentIds.filter((id) =>
    studentIds.has(id)
  )
  const currentQuestionId =
    quizPlay.currentQuestionId && questionIds.has(quizPlay.currentQuestionId)
      ? quizPlay.currentQuestionId
      : null
  const currentStudentId =
    quizPlay.currentStudentId && studentIds.has(quizPlay.currentStudentId)
      ? quizPlay.currentStudentId
      : null
  const answerRevealed = currentQuestionId ? quizPlay.answerRevealed : false

  return {
    selectedQuizId: selectedQuiz.id,
    usedQuestionIds,
    usedStudentIds,
    currentQuestionId,
    currentStudentId,
    answerRevealed,
  }
}

const pruneDomainState = (
  domain: AppState["domain"],
  students: Student[],
  quizzes: Record<string, Quiz>
) => ({
  generator: pruneGeneratorState(domain.generator, students),
  quizPlay: pruneQuizPlayState(domain.quizPlay, students, quizzes),
})

const getSortedQuizIndex = (index: QuizIndexEntry[]) =>
  [...index].sort((a, b) => b.createdAt - a.createdAt)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE_PERSISTED": {
      const persisted = action.payload
      return {
        ...state,
        persisted,
        domain: pruneDomainState(state.domain, persisted.students, persisted.quizzes),
        ui: {
          ...state.ui,
          isHydrated: true,
        },
      }
    }
    case "ADD_STUDENT": {
      const normalized = normalizeStudentName(action.payload.name)
      if (!normalized) return state
      const nextKey = studentNameKey(normalized)
      const alreadyExists = state.persisted.students.some(
        (student) => studentNameKey(student.name) === nextKey
      )
      if (alreadyExists) return state

      const nextStudent: Student = {
        id: action.payload.id,
        name: normalized,
        status: "active",
        createdAt: Date.now(),
      }
      const students = [...state.persisted.students, nextStudent]
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes),
      }
    }
    case "TOGGLE_STUDENT_EXCLUDED": {
      const students = state.persisted.students.map((student) =>
        student.id === action.payload.id
          ? {
              ...student,
              status: student.status === "active" ? "excluded" : "active",
            }
          : student
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes),
      }
    }
    case "DELETE_STUDENT": {
      const students = state.persisted.students.filter(
        (student) => student.id !== action.payload.id
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes),
      }
    }
    case "UPDATE_STUDENT": {
      const normalized = normalizeStudentName(action.payload.name)
      if (!normalized) return state
      const nextKey = studentNameKey(normalized)
      const hasDuplicate = state.persisted.students.some(
        (student) =>
          student.id !== action.payload.id &&
          studentNameKey(student.name) === nextKey
      )
      if (hasDuplicate) return state

      const students = state.persisted.students.map((student) =>
        student.id === action.payload.id ? { ...student, name: normalized } : student
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes),
      }
    }
    case "CLEAR_STUDENTS": {
      const students: Student[] = []
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes),
      }
    }
    case "RESET_GENERATOR": {
      return {
        ...state,
        domain: {
          ...state.domain,
          generator: {
            usedStudentIds: [],
            currentStudentId: null,
          },
        },
      }
    }
    case "DRAW_STUDENT": {
      const availableStudentIds = state.persisted.students
        .filter((student) => student.status === "active")
        .filter(
          (student) =>
            !state.domain.generator.usedStudentIds.includes(student.id)
        )
        .map((student) => student.id)

      if (!availableStudentIds.length) return state

      const nextStudentId =
        availableStudentIds[
          Math.floor(Math.random() * availableStudentIds.length)
        ]

      return {
        ...state,
        domain: {
          ...state.domain,
          generator: {
            currentStudentId: nextStudentId,
            usedStudentIds: [
              ...state.domain.generator.usedStudentIds,
              nextStudentId,
            ],
          },
        },
      }
    }
    case "CREATE_QUIZ": {
      const title = action.payload.title.trim()
      if (!title) return state
      const timestamp = Date.now()
      const quiz: Quiz = {
        id: action.payload.id,
        title,
        questions: action.payload.questions,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      const quizIndexEntry: QuizIndexEntry = {
        id: quiz.id,
        title: quiz.title,
        createdAt: quiz.createdAt,
      }
      const quizIndex = getSortedQuizIndex([
        ...state.persisted.quizIndex,
        quizIndexEntry,
      ])
      const quizzes = {
        ...state.persisted.quizzes,
        [quiz.id]: quiz,
      }
      return {
        ...state,
        persisted: {
          ...state.persisted,
          quizIndex,
          quizzes,
        },
        domain: pruneDomainState(state.domain, state.persisted.students, quizzes),
        ui: {
          ...state.ui,
          quizEditor: {
            ...state.ui.quizEditor,
            activeQuizId: quiz.id,
            editingQuestionId: null,
          },
        },
      }
    }
    case "UPDATE_QUIZ": {
      const existing = state.persisted.quizzes[action.payload.id]
      if (!existing) return state
      const title = action.payload.title.trim()
      if (!title) return state
      const updated: Quiz = {
        ...existing,
        title,
        questions: action.payload.questions,
        updatedAt: Date.now(),
      }
      const quizzes = {
        ...state.persisted.quizzes,
        [updated.id]: updated,
      }
      const quizIndex = getSortedQuizIndex(
        state.persisted.quizIndex.map((entry) =>
          entry.id === updated.id ? { ...entry, title: updated.title } : entry
        )
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          quizIndex,
          quizzes,
        },
        domain: pruneDomainState(state.domain, state.persisted.students, quizzes),
      }
    }
    case "DELETE_QUIZ": {
      const quizIndex = state.persisted.quizIndex.filter(
        (entry) => entry.id !== action.payload.id
      )
      const quizzes = { ...state.persisted.quizzes }
      delete quizzes[action.payload.id]

      const nextActiveId =
        state.ui.quizEditor.activeQuizId === action.payload.id
          ? null
          : state.ui.quizEditor.activeQuizId

      return {
        ...state,
        persisted: {
          ...state.persisted,
          quizIndex,
          quizzes,
        },
        domain: pruneDomainState(state.domain, state.persisted.students, quizzes),
        ui: {
          ...state.ui,
          quizEditor: {
            ...state.ui.quizEditor,
            activeQuizId: nextActiveId,
            editingQuestionId: null,
          },
        },
      }
    }
    case "SELECT_QUIZ_FOR_EDITOR": {
      const nextId =
        action.payload.id && state.persisted.quizzes[action.payload.id]
          ? action.payload.id
          : null
      return {
        ...state,
        ui: {
          ...state.ui,
          quizEditor: {
            ...state.ui.quizEditor,
            activeQuizId: nextId,
            editingQuestionId: null,
          },
        },
      }
    }
    case "SET_EDITING_QUESTION": {
      return {
        ...state,
        ui: {
          ...state.ui,
          quizEditor: {
            ...state.ui.quizEditor,
            editingQuestionId: action.payload.id,
          },
        },
      }
    }
    case "SELECT_QUIZ_FOR_PLAY": {
      const nextId =
        action.payload.id && state.persisted.quizzes[action.payload.id]
          ? action.payload.id
          : null
      return {
        ...state,
        domain: {
          ...state.domain,
          quizPlay: {
            selectedQuizId: nextId,
            usedQuestionIds: [],
            usedStudentIds: [],
            currentQuestionId: null,
            currentStudentId: null,
            answerRevealed: false,
          },
        },
      }
    }
    case "DRAW_QUIZ_PAIR": {
      const quizId = state.domain.quizPlay.selectedQuizId
      if (!quizId) return state
      const quiz = state.persisted.quizzes[quizId]
      if (!quiz) return state

      const availableQuestionIds = quiz.questions
        .filter((question) => !state.domain.quizPlay.usedQuestionIds.includes(question.id))
        .map((question) => question.id)
      const availableStudentIds = state.persisted.students
        .filter((student) => student.status === "active")
        .filter((student) => !state.domain.quizPlay.usedStudentIds.includes(student.id))
        .map((student) => student.id)

      if (!availableQuestionIds.length || !availableStudentIds.length) return state

      const nextQuestionId =
        availableQuestionIds[
          Math.floor(Math.random() * availableQuestionIds.length)
        ]
      const nextStudentId =
        availableStudentIds[
          Math.floor(Math.random() * availableStudentIds.length)
        ]

      return {
        ...state,
        domain: {
          ...state.domain,
          quizPlay: {
            ...state.domain.quizPlay,
            currentQuestionId: nextQuestionId,
            currentStudentId: nextStudentId,
            usedQuestionIds: [...state.domain.quizPlay.usedQuestionIds, nextQuestionId],
            usedStudentIds: [...state.domain.quizPlay.usedStudentIds, nextStudentId],
            answerRevealed: false,
          },
        },
      }
    }
    case "REVEAL_ANSWER": {
      if (!state.domain.quizPlay.currentQuestionId) return state
      return {
        ...state,
        domain: {
          ...state.domain,
          quizPlay: {
            ...state.domain.quizPlay,
            answerRevealed: true,
          },
        },
      }
    }
    case "RESET_QUIZ_PLAY": {
      return {
        ...state,
        domain: {
          ...state.domain,
          quizPlay: {
            ...state.domain.quizPlay,
            usedQuestionIds: [],
            usedStudentIds: [],
            currentQuestionId: null,
            currentStudentId: null,
            answerRevealed: false,
          },
        },
      }
    }
    default:
      return state
  }
}

const AppStoreContext = React.createContext<{
  state: AppState
  actions: {
    addStudent: (name: string) => void
    toggleStudentExcluded: (id: string) => void
    deleteStudent: (id: string) => void
    clearStudents: () => void
    updateStudent: (id: string, name: string) => void
    resetGenerator: () => void
    drawStudent: () => void
    createQuiz: (title: string, questions: Question[]) => void
    updateQuiz: (id: string, title: string, questions: Question[]) => void
    deleteQuiz: (id: string) => void
    selectQuizForEditor: (id: string | null) => void
    setEditingQuestion: (id: string | null) => void
    selectQuizForPlay: (id: string | null) => void
    drawQuizPair: () => void
    revealAnswer: () => void
    resetQuizPlay: () => void
  }
} | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, initialState)

  React.useEffect(() => {
    const persisted = loadPersistedState()
    dispatch({ type: "HYDRATE_PERSISTED", payload: persisted })
  }, [])

  React.useEffect(() => {
    if (!state.ui.isHydrated) return
    saveStudents(state.persisted.students)
    saveQuizIndex(state.persisted.quizIndex)
    persistAllQuizzes(state.persisted.quizIndex, state.persisted.quizzes)
  }, [state.persisted, state.ui.isHydrated])

  const actions = React.useMemo(
    () => ({
      addStudent: (name: string) =>
        dispatch({
          type: "ADD_STUDENT",
          payload: { id: crypto.randomUUID(), name },
        }),
      toggleStudentExcluded: (id: string) =>
        dispatch({ type: "TOGGLE_STUDENT_EXCLUDED", payload: { id } }),
      deleteStudent: (id: string) =>
        dispatch({ type: "DELETE_STUDENT", payload: { id } }),
      clearStudents: () => dispatch({ type: "CLEAR_STUDENTS" }),
      updateStudent: (id: string, name: string) =>
        dispatch({ type: "UPDATE_STUDENT", payload: { id, name } }),
      resetGenerator: () => dispatch({ type: "RESET_GENERATOR" }),
      drawStudent: () => dispatch({ type: "DRAW_STUDENT" }),
      createQuiz: (title: string, questions: Question[]) =>
        dispatch({
          type: "CREATE_QUIZ",
          payload: { id: crypto.randomUUID(), title, questions },
        }),
      updateQuiz: (id: string, title: string, questions: Question[]) =>
        dispatch({
          type: "UPDATE_QUIZ",
          payload: { id, title, questions },
        }),
      deleteQuiz: (id: string) =>
        dispatch({ type: "DELETE_QUIZ", payload: { id } }),
      selectQuizForEditor: (id: string | null) =>
        dispatch({ type: "SELECT_QUIZ_FOR_EDITOR", payload: { id } }),
      setEditingQuestion: (id: string | null) =>
        dispatch({ type: "SET_EDITING_QUESTION", payload: { id } }),
      selectQuizForPlay: (id: string | null) =>
        dispatch({ type: "SELECT_QUIZ_FOR_PLAY", payload: { id } }),
      drawQuizPair: () => dispatch({ type: "DRAW_QUIZ_PAIR" }),
      revealAnswer: () => dispatch({ type: "REVEAL_ANSWER" }),
      resetQuizPlay: () => dispatch({ type: "RESET_QUIZ_PLAY" }),
    }),
    []
  )

  return (
    <AppStoreContext.Provider value={{ state, actions }}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const context = React.useContext(AppStoreContext)
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider")
  }
  return context
}
