import type {
  BreakoutGroups,
  ProjectList,
  Quiz,
  QuizIndexEntry,
  Student,
} from "@/lib/models"
import {
  isBreakoutGroups,
  isPersistedTimerState,
  isProjectList,
  isQuiz,
  isQuizIndexEntry,
  isStudent,
} from "@/lib/type-guards"

const STUDENTS_KEY = "teacherbuddy:students"
const QUIZ_INDEX_KEY = "teacherbuddy:quiz-index"
const PROJECT_LISTS_KEY = "teacherbuddy:project-lists"
const BREAKOUT_GROUPS_KEY = "teacherbuddy:breakout-groups"
const TIMER_KEY = "teacherbuddy:timer"

const quizKey = (id: string) => `teacherbuddy:quiz:${id}`

export type PersistedTimerState = {
  configuredTotalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  savedAt: number
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.error("Failed to parse localStorage payload", error)
    return fallback
  }
}

export function loadStudents(): Student[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<unknown>(localStorage.getItem(STUDENTS_KEY), [])
  if (!Array.isArray(parsed)) return []
  // Handle legacy format (array of strings)
  if (parsed.length && parsed.every((entry) => typeof entry === "string")) {
    return (parsed as string[]).map((name) => ({
      id: crypto.randomUUID(),
      name,
      status: "active",
      createdAt: Date.now(),
    }))
  }
  return parsed.filter(isStudent)
}

export function saveStudents(students: Student[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

export function loadQuizIndex(): QuizIndexEntry[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<unknown>(localStorage.getItem(QUIZ_INDEX_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isQuizIndexEntry)
}

export function loadProjectLists(): ProjectList[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<unknown>(localStorage.getItem(PROJECT_LISTS_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed
    .filter(isProjectList)
    .map((entry) => {
      const e = entry as Record<string, unknown>
      return {
        ...entry,
        description: entry.description ?? "",
        createdAt:
          typeof e.createdAt === "number" ? e.createdAt : Date.now(),
      }
    })
}

export function saveProjectLists(lists: ProjectList[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(PROJECT_LISTS_KEY, JSON.stringify(lists))
}

export function loadBreakoutGroups(): BreakoutGroups | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(BREAKOUT_GROUPS_KEY), null)
  if (!isBreakoutGroups(parsed)) return null
  return parsed
}

export function saveBreakoutGroups(groups: BreakoutGroups | null) {
  if (typeof window === "undefined") return
  if (!groups) {
    localStorage.removeItem(BREAKOUT_GROUPS_KEY)
    return
  }
  localStorage.setItem(BREAKOUT_GROUPS_KEY, JSON.stringify(groups))
}

export function saveQuizIndex(index: QuizIndexEntry[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(QUIZ_INDEX_KEY, JSON.stringify(index))
}

export function loadQuiz(id: string): Quiz | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(quizKey(id)), null)
  if (!isQuiz(parsed)) return null
  return parsed
}

export function saveQuiz(quiz: Quiz) {
  if (typeof window === "undefined") return
  localStorage.setItem(quizKey(quiz.id), JSON.stringify(quiz))
}

export function removeQuiz(id: string) {
  if (typeof window === "undefined") return
  localStorage.removeItem(quizKey(id))
}

export function loadPersistedState(): {
  students: Student[]
  quizIndex: QuizIndexEntry[]
  projectLists: ProjectList[]
  breakoutGroups: BreakoutGroups | null
  quizzes: Record<string, Quiz>
} {
  const students = loadStudents()
  const quizIndex = loadQuizIndex()
  const projectLists = loadProjectLists()
  const breakoutGroups = loadBreakoutGroups()
  const quizzes: Record<string, Quiz> = {}
  const cleanedIndex: QuizIndexEntry[] = []

  for (const entry of quizIndex) {
    const quiz = loadQuiz(entry.id)
    if (quiz) {
      quizzes[entry.id] = quiz
      cleanedIndex.push(entry)
    }
  }

  return {
    students,
    quizIndex: cleanedIndex,
    projectLists,
    breakoutGroups,
    quizzes,
  }
}

export function persistAllQuizzes(
  quizIndex: QuizIndexEntry[],
  quizzes: Record<string, Quiz>
) {
  const ids = new Set(quizIndex.map((entry) => entry.id))
  for (const entry of quizIndex) {
    const quiz = quizzes[entry.id]
    if (quiz) {
      saveQuiz(quiz)
    }
  }
  for (const id of Object.keys(quizzes)) {
    if (!ids.has(id)) {
      removeQuiz(id)
    }
  }
}

export function loadTimer(): PersistedTimerState | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(TIMER_KEY), null)
  if (!isPersistedTimerState(parsed)) return null
  if (parsed.remainingSeconds <= 0) return null
  return parsed
}

export function saveTimer(state: PersistedTimerState) {
  if (typeof window === "undefined") return
  localStorage.setItem(TIMER_KEY, JSON.stringify(state))
}

export function clearTimer() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TIMER_KEY)
}
