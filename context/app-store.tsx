"use client"

import * as React from "react"

import type {
  BreakoutGroups,
  Classroom,
  ProjectList,
  Question,
  Quiz,
  QuizIndexEntry,
  Student,
} from "@/lib/models"
import {
  loadPersistedState,
  persistAllQuizzes,
  saveActiveClassId,
  saveBreakoutGroupsByClass,
  saveClasses,
  saveProjectLists,
  saveQuizIndex,
  saveStudents,
} from "@/lib/storage"
import { normalizeClassName, type ImportedClassRecord } from "@/lib/classes"
import { normalizeStudentName, studentNameKey } from "@/lib/students"

export type PersistedState = {
  classes: Classroom[]
  activeClassId: string | null
  students: Student[]
  quizIndex: QuizIndexEntry[]
  quizzes: Record<string, Quiz>
  projectLists: ProjectList[]
  breakoutGroupsByClass: Record<string, BreakoutGroups>
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
    classes: [],
    activeClassId: null,
    students: [],
    quizIndex: [],
    quizzes: {},
    projectLists: [],
    breakoutGroupsByClass: {},
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
  | { type: "ADD_CLASS"; payload: { id: string; name: string } }
  | { type: "SELECT_ACTIVE_CLASS"; payload: { id: string | null } }
  | { type: "DELETE_CLASS"; payload: { id: string } }
  | { type: "CLEAR_CLASSES" }
  | { type: "IMPORT_CLASS_RECORDS"; payload: { classes: ImportedClassRecord[] } }
  | { type: "ADD_STUDENT"; payload: { id: string; name: string } }
  | { type: "TOGGLE_STUDENT_EXCLUDED"; payload: { id: string } }
  | { type: "DELETE_STUDENT"; payload: { id: string } }
  | { type: "CLEAR_STUDENTS" }
  | {
      type: "UPDATE_STUDENT"
      payload: { id: string; name: string; classId: string | null }
    }
  | {
      type: "CREATE_PROJECT_LIST"
      payload: {
        id: string
        name: string
        projectType: string
        description: string
        studentIds: string[]
        groups: string[][]
      }
    }
  | {
      type: "UPDATE_PROJECT_LIST"
      payload: {
        id: string
        name: string
        projectType: string
        description: string
        studentIds: string[]
        groups: string[][]
      }
    }
  | { type: "DELETE_PROJECT_LIST"; payload: { id: string } }
  | { type: "SET_BREAKOUT_GROUPS"; payload: BreakoutGroups }
  | { type: "CLEAR_BREAKOUT_GROUPS" }
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

/**
 * Returns students that belong to the provided class.
 * Used to scope roster-driven tools to the active class.
 */
const getStudentsForClass = (students: Student[], classId: string | null) => {
  if (!classId) return []
  return students.filter((student) => student.classId === classId)
}

/**
 * Resolves a valid active class ID from available classes.
 * Falls back to the first class or null when no classes exist.
 */
const resolveActiveClassId = (
  classes: Classroom[],
  activeClassId: string | null
): string | null => {
  if (!classes.length) return null
  if (activeClassId && classes.some((entry) => entry.id === activeClassId)) {
    return activeClassId
  }
  return classes[0].id
}

const getStudentIdSet = (students: Student[]) =>
  new Set(students.map((student) => student.id))

const pruneGeneratorState = (
  generator: GeneratorState,
  students: Student[],
  activeClassId: string | null
) => {
  const classStudents = getStudentsForClass(students, activeClassId)
  const studentIds = getStudentIdSet(classStudents)
  const usedStudentIds = generator.usedStudentIds.filter((id) => studentIds.has(id))
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
  quizzes: Record<string, Quiz>,
  activeClassId: string | null
) => {
  const classStudents = getStudentsForClass(students, activeClassId)
  const studentIds = getStudentIdSet(classStudents)
  const selectedQuiz = quizPlay.selectedQuizId ? quizzes[quizPlay.selectedQuizId] : null

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
  const usedQuestionIds = quizPlay.usedQuestionIds.filter((id) => questionIds.has(id))
  const usedStudentIds = quizPlay.usedStudentIds.filter((id) => studentIds.has(id))
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
  quizzes: Record<string, Quiz>,
  activeClassId: string | null
) => ({
  generator: pruneGeneratorState(domain.generator, students, activeClassId),
  quizPlay: pruneQuizPlayState(domain.quizPlay, students, quizzes, activeClassId),
})

const getSortedQuizIndex = (index: QuizIndexEntry[]) =>
  [...index].sort((a, b) => b.createdAt - a.createdAt)

const toggleStudentStatus = (status: Student["status"]): Student["status"] =>
  status === "active" ? "excluded" : "active"

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE_PERSISTED": {
      const persisted = action.payload
      const activeClassId = resolveActiveClassId(
        persisted.classes,
        persisted.activeClassId
      )
      return {
        ...state,
        persisted: {
          ...persisted,
          activeClassId,
        },
        domain: pruneDomainState(
          state.domain,
          persisted.students,
          persisted.quizzes,
          activeClassId
        ),
        ui: {
          ...state.ui,
          isHydrated: true,
        },
      }
    }
    case "ADD_CLASS": {
      const normalized = normalizeClassName(action.payload.name)
      if (!normalized) return state

      const exists = state.persisted.classes.some(
        (entry) => normalizeClassName(entry.name).toLocaleLowerCase() === normalized.toLocaleLowerCase()
      )
      if (exists) return state

      const classes = [
        ...state.persisted.classes,
        {
          id: action.payload.id,
          name: normalized,
          createdAt: Date.now(),
        },
      ]
      const activeClassId = state.persisted.activeClassId ?? action.payload.id

      return {
        ...state,
        persisted: {
          ...state.persisted,
          classes,
          activeClassId,
        },
      }
    }
    case "SELECT_ACTIVE_CLASS": {
      const activeClassId = resolveActiveClassId(
        state.persisted.classes,
        action.payload.id
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          activeClassId,
        },
        domain: pruneDomainState(
          state.domain,
          state.persisted.students,
          state.persisted.quizzes,
          activeClassId
        ),
      }
    }
    case "DELETE_CLASS": {
      const classes = state.persisted.classes.filter(
        (entry) => entry.id !== action.payload.id
      )
      const activeClassId = resolveActiveClassId(
        classes,
        state.persisted.activeClassId === action.payload.id
          ? null
          : state.persisted.activeClassId
      )

      const students = state.persisted.students.filter(
        (student) => student.classId !== action.payload.id
      )
      const projectLists = state.persisted.projectLists.filter(
        (list) => list.classId !== action.payload.id
      )

      const breakoutGroupsByClass = { ...state.persisted.breakoutGroupsByClass }
      delete breakoutGroupsByClass[action.payload.id]

      return {
        ...state,
        persisted: {
          ...state.persisted,
          classes,
          activeClassId,
          students,
          projectLists,
          breakoutGroupsByClass,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes, activeClassId),
      }
    }
    case "CLEAR_CLASSES": {
      return {
        ...state,
        persisted: {
          ...state.persisted,
          classes: [],
          activeClassId: null,
          students: [],
          projectLists: [],
          breakoutGroupsByClass: {},
        },
        domain: pruneDomainState(state.domain, [], state.persisted.quizzes, null),
      }
    }
    case "IMPORT_CLASS_RECORDS": {
      let classes = [...state.persisted.classes]
      let students = [...state.persisted.students]

      const classNameToId = new Map(
        classes.map((entry) => [normalizeClassName(entry.name).toLocaleLowerCase(), entry.id])
      )

      const classIdSet = new Set(classes.map((entry) => entry.id))
      const studentIdSet = new Set(students.map((student) => student.id))

      for (const classRecord of action.payload.classes) {
        const normalizedClassName = normalizeClassName(classRecord.className)
        if (!normalizedClassName) continue

        const classKey = normalizedClassName.toLocaleLowerCase()
        let classId = classNameToId.get(classKey) ?? null

        if (!classId) {
          const hintedId =
            classRecord.idHint && !classIdSet.has(classRecord.idHint)
              ? classRecord.idHint
              : null
          classId = hintedId ?? crypto.randomUUID()
          classIdSet.add(classId)
          classNameToId.set(classKey, classId)
          classes = [
            ...classes,
            {
              id: classId,
              name: normalizedClassName,
              createdAt: Date.now(),
            },
          ]
        }

        const dedupeByName = new Set<string>()
        const importedStudents: Student[] = []

        for (const studentRecord of classRecord.students) {
          const normalizedStudentName = normalizeStudentName(studentRecord.name)
          if (!normalizedStudentName) continue

          const studentKey = studentNameKey(normalizedStudentName)
          if (dedupeByName.has(studentKey)) continue
          dedupeByName.add(studentKey)

          const hintedStudentId =
            studentRecord.idHint && !studentIdSet.has(studentRecord.idHint)
              ? studentRecord.idHint
              : null
          const studentId = hintedStudentId ?? crypto.randomUUID()
          studentIdSet.add(studentId)

          importedStudents.push({
            id: studentId,
            name: normalizedStudentName,
            status: "active",
            classId,
            createdAt: Date.now(),
          })
        }

        students = [
          ...students.filter((student) => student.classId !== classId),
          ...importedStudents,
        ]
      }

      const activeClassId = resolveActiveClassId(
        classes,
        state.persisted.activeClassId
      )

      return {
        ...state,
        persisted: {
          ...state.persisted,
          classes,
          students,
          activeClassId,
        },
        domain: pruneDomainState(state.domain, students, state.persisted.quizzes, activeClassId),
      }
    }
    case "ADD_STUDENT": {
      const activeClassId = state.persisted.activeClassId
      if (!activeClassId) return state

      const normalized = normalizeStudentName(action.payload.name)
      if (!normalized) return state

      const nextKey = studentNameKey(normalized)
      const alreadyExists = state.persisted.students.some(
        (student) =>
          student.classId === activeClassId &&
          studentNameKey(student.name) === nextKey
      )
      if (alreadyExists) return state

      const nextStudent: Student = {
        id: action.payload.id,
        name: normalized,
        status: "active",
        classId: activeClassId,
        createdAt: Date.now(),
      }
      const students = [...state.persisted.students, nextStudent]
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(
          state.domain,
          students,
          state.persisted.quizzes,
          activeClassId
        ),
      }
    }
    case "TOGGLE_STUDENT_EXCLUDED": {
      const students = state.persisted.students.map((student) =>
        student.id === action.payload.id
          ? {
              ...student,
              status: toggleStudentStatus(student.status),
            }
          : student
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(
          state.domain,
          students,
          state.persisted.quizzes,
          state.persisted.activeClassId
        ),
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
        domain: pruneDomainState(
          state.domain,
          students,
          state.persisted.quizzes,
          state.persisted.activeClassId
        ),
      }
    }
    case "UPDATE_STUDENT": {
      const existingStudent = state.persisted.students.find(
        (student) => student.id === action.payload.id
      )
      if (!existingStudent) return state

      const normalizedName = normalizeStudentName(action.payload.name)
      if (!normalizedName) return state

      const nextClassId =
        action.payload.classId &&
        state.persisted.classes.some((entry) => entry.id === action.payload.classId)
          ? action.payload.classId
          : existingStudent.classId

      const nextKey = studentNameKey(normalizedName)
      const hasDuplicate = state.persisted.students.some(
        (student) =>
          student.id !== action.payload.id &&
          student.classId === nextClassId &&
          studentNameKey(student.name) === nextKey
      )
      if (hasDuplicate) return state

      const students = state.persisted.students.map((student) =>
        student.id === action.payload.id
          ? { ...student, name: normalizedName, classId: nextClassId }
          : student
      )

      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
        },
        domain: pruneDomainState(
          state.domain,
          students,
          state.persisted.quizzes,
          state.persisted.activeClassId
        ),
      }
    }
    case "CLEAR_STUDENTS": {
      const activeClassId = state.persisted.activeClassId
      if (!activeClassId) return state

      const students = state.persisted.students.filter(
        (student) => student.classId !== activeClassId
      )

      const projectLists = state.persisted.projectLists.filter(
        (list) => list.classId !== activeClassId
      )

      const breakoutGroupsByClass = { ...state.persisted.breakoutGroupsByClass }
      delete breakoutGroupsByClass[activeClassId]

      return {
        ...state,
        persisted: {
          ...state.persisted,
          students,
          projectLists,
          breakoutGroupsByClass,
        },
        domain: pruneDomainState(
          state.domain,
          students,
          state.persisted.quizzes,
          activeClassId
        ),
      }
    }
    case "CREATE_PROJECT_LIST": {
      const classId = state.persisted.activeClassId
      if (!classId) return state
      const name = action.payload.name.trim()
      const projectType = action.payload.projectType.trim()
      if (!name || !projectType) return state
      const studentIds = action.payload.studentIds
      if (!studentIds.length) return state
      const projectList: ProjectList = {
        id: action.payload.id,
        classId,
        name,
        projectType,
        description: action.payload.description.trim(),
        studentIds,
        groups: action.payload.groups,
        createdAt: Date.now(),
      }
      return {
        ...state,
        persisted: {
          ...state.persisted,
          projectLists: [projectList, ...state.persisted.projectLists],
        },
      }
    }
    case "UPDATE_PROJECT_LIST": {
      const existing = state.persisted.projectLists.find(
        (list) => list.id === action.payload.id
      )
      if (!existing) return state
      const name = action.payload.name.trim()
      const projectType = action.payload.projectType.trim()
      if (!name || !projectType) return state
      const studentIds = action.payload.studentIds
      if (!studentIds.length) return state
      const projectLists = state.persisted.projectLists.map((list) =>
        list.id === action.payload.id
          ? {
              ...list,
              classId: existing.classId,
              name,
              projectType,
              description: action.payload.description.trim(),
              studentIds,
              groups: action.payload.groups,
            }
          : list
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          projectLists,
        },
      }
    }
    case "SET_BREAKOUT_GROUPS": {
      return {
        ...state,
        persisted: {
          ...state.persisted,
          breakoutGroupsByClass: {
            ...state.persisted.breakoutGroupsByClass,
            [action.payload.classId]: action.payload,
          },
        },
      }
    }
    case "DELETE_PROJECT_LIST": {
      const projectLists = state.persisted.projectLists.filter(
        (list) => list.id !== action.payload.id
      )
      return {
        ...state,
        persisted: {
          ...state.persisted,
          projectLists,
        },
      }
    }
    case "CLEAR_BREAKOUT_GROUPS": {
      const activeClassId = state.persisted.activeClassId
      if (!activeClassId) return state
      const breakoutGroupsByClass = { ...state.persisted.breakoutGroupsByClass }
      delete breakoutGroupsByClass[activeClassId]
      return {
        ...state,
        persisted: {
          ...state.persisted,
          breakoutGroupsByClass,
        },
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
      const activeClassId = state.persisted.activeClassId
      const availableStudentIds = getStudentsForClass(
        state.persisted.students,
        activeClassId
      )
        .filter((student) => student.status === "active")
        .filter((student) => !state.domain.generator.usedStudentIds.includes(student.id))
        .map((student) => student.id)

      if (!availableStudentIds.length) return state

      const nextStudentId =
        availableStudentIds[Math.floor(Math.random() * availableStudentIds.length)]

      return {
        ...state,
        domain: {
          ...state.domain,
          generator: {
            currentStudentId: nextStudentId,
            usedStudentIds: [...state.domain.generator.usedStudentIds, nextStudentId],
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
      const quizIndex = getSortedQuizIndex([...state.persisted.quizIndex, quizIndexEntry])
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
        domain: pruneDomainState(
          state.domain,
          state.persisted.students,
          quizzes,
          state.persisted.activeClassId
        ),
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
        domain: pruneDomainState(
          state.domain,
          state.persisted.students,
          quizzes,
          state.persisted.activeClassId
        ),
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
        domain: pruneDomainState(
          state.domain,
          state.persisted.students,
          quizzes,
          state.persisted.activeClassId
        ),
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

      const availableStudentIds = getStudentsForClass(
        state.persisted.students,
        state.persisted.activeClassId
      )
        .filter((student) => student.status === "active")
        .filter((student) => !state.domain.quizPlay.usedStudentIds.includes(student.id))
        .map((student) => student.id)

      if (!availableQuestionIds.length || !availableStudentIds.length) return state

      const nextQuestionId =
        availableQuestionIds[Math.floor(Math.random() * availableQuestionIds.length)]
      const nextStudentId =
        availableStudentIds[Math.floor(Math.random() * availableStudentIds.length)]

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
    addClass: (name: string) => void
    selectActiveClass: (id: string | null) => void
    deleteClass: (id: string) => void
    clearClasses: () => void
    importClassRecords: (classes: ImportedClassRecord[]) => void
    addStudent: (name: string) => void
    toggleStudentExcluded: (id: string) => void
    deleteStudent: (id: string) => void
    clearStudents: () => void
    updateStudent: (id: string, name: string, classId: string | null) => void
    createProjectList: (
      name: string,
      projectType: string,
      description: string,
      studentIds: string[],
      groups: string[][]
    ) => void
    updateProjectList: (
      id: string,
      name: string,
      projectType: string,
      description: string,
      studentIds: string[],
      groups: string[][]
    ) => void
    deleteProjectList: (id: string) => void
    setBreakoutGroups: (groups: BreakoutGroups) => void
    clearBreakoutGroups: () => void
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

/**
 * Provides global TeacherBuddy state and actions to all child components.
 * Mount once near the app root so hooks can access persisted and class-scoped state.
 */
export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, initialState)

  React.useEffect(() => {
    const persisted = loadPersistedState()
    dispatch({ type: "HYDRATE_PERSISTED", payload: persisted })
  }, [])

  React.useEffect(() => {
    if (!state.ui.isHydrated) return
    saveClasses(state.persisted.classes)
    saveActiveClassId(state.persisted.activeClassId)
    saveStudents(state.persisted.students)
    saveQuizIndex(state.persisted.quizIndex)
    persistAllQuizzes(state.persisted.quizIndex, state.persisted.quizzes)
    saveProjectLists(state.persisted.projectLists)
    saveBreakoutGroupsByClass(state.persisted.breakoutGroupsByClass)
  }, [state.persisted, state.ui.isHydrated])

  const actions = React.useMemo(
    () => ({
      addClass: (name: string) =>
        dispatch({
          type: "ADD_CLASS",
          payload: { id: crypto.randomUUID(), name },
        }),
      selectActiveClass: (id: string | null) =>
        dispatch({ type: "SELECT_ACTIVE_CLASS", payload: { id } }),
      deleteClass: (id: string) => dispatch({ type: "DELETE_CLASS", payload: { id } }),
      clearClasses: () => dispatch({ type: "CLEAR_CLASSES" }),
      importClassRecords: (classes: ImportedClassRecord[]) =>
        dispatch({ type: "IMPORT_CLASS_RECORDS", payload: { classes } }),
      addStudent: (name: string) =>
        dispatch({
          type: "ADD_STUDENT",
          payload: { id: crypto.randomUUID(), name },
        }),
      toggleStudentExcluded: (id: string) =>
        dispatch({ type: "TOGGLE_STUDENT_EXCLUDED", payload: { id } }),
      deleteStudent: (id: string) => dispatch({ type: "DELETE_STUDENT", payload: { id } }),
      clearStudents: () => dispatch({ type: "CLEAR_STUDENTS" }),
      updateStudent: (id: string, name: string, classId: string | null) =>
        dispatch({ type: "UPDATE_STUDENT", payload: { id, name, classId } }),
      createProjectList: (
        name: string,
        projectType: string,
        description: string,
        studentIds: string[],
        groups: string[][]
      ) =>
        dispatch({
          type: "CREATE_PROJECT_LIST",
          payload: {
            id: crypto.randomUUID(),
            name,
            projectType,
            description,
            studentIds,
            groups,
          },
        }),
      updateProjectList: (
        id: string,
        name: string,
        projectType: string,
        description: string,
        studentIds: string[],
        groups: string[][]
      ) =>
        dispatch({
          type: "UPDATE_PROJECT_LIST",
          payload: {
            id,
            name,
            projectType,
            description,
            studentIds,
            groups,
          },
        }),
      deleteProjectList: (id: string) =>
        dispatch({ type: "DELETE_PROJECT_LIST", payload: { id } }),
      setBreakoutGroups: (groups: BreakoutGroups) =>
        dispatch({ type: "SET_BREAKOUT_GROUPS", payload: groups }),
      clearBreakoutGroups: () => dispatch({ type: "CLEAR_BREAKOUT_GROUPS" }),
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
      deleteQuiz: (id: string) => dispatch({ type: "DELETE_QUIZ", payload: { id } }),
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

  return <AppStoreContext.Provider value={{ state, actions }}>{children}</AppStoreContext.Provider>
}

/**
 * Returns the app store context with current state and bound action creators.
 * Must be used within `AppStoreProvider`.
 */
export function useAppStore() {
  const context = React.useContext(AppStoreContext)
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider")
  }
  return context
}
