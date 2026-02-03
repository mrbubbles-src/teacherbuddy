import type { Quiz, QuizIndexEntry, Student } from "@/lib/models"

const STUDENTS_KEY = "teacherbuddy:students"
const QUIZ_INDEX_KEY = "teacherbuddy:quiz-index"
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
  if (parsed.length && parsed.every((entry) => typeof entry === "string")) {
    return (parsed as string[]).map((name) => ({
      id: crypto.randomUUID(),
      name,
      status: "active",
      createdAt: Date.now(),
    }))
  }
  return parsed.filter((entry): entry is Student => {
    return (
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as Student).id === "string" &&
      typeof (entry as Student).name === "string" &&
      typeof (entry as Student).status === "string" &&
      typeof (entry as Student).createdAt === "number"
    )
  })
}

export function saveStudents(students: Student[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

export function loadQuizIndex(): QuizIndexEntry[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<unknown>(localStorage.getItem(QUIZ_INDEX_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter((entry): entry is QuizIndexEntry => {
    return (
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as QuizIndexEntry).id === "string" &&
      typeof (entry as QuizIndexEntry).title === "string" &&
      typeof (entry as QuizIndexEntry).createdAt === "number"
    )
  })
}

export function saveQuizIndex(index: QuizIndexEntry[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(QUIZ_INDEX_KEY, JSON.stringify(index))
}

export function loadQuiz(id: string): Quiz | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(quizKey(id)), null)
  if (!parsed || typeof parsed !== "object") return null
  const quiz = parsed as Quiz
  if (
    typeof quiz.id !== "string" ||
    typeof quiz.title !== "string" ||
    !Array.isArray(quiz.questions) ||
    typeof quiz.createdAt !== "number" ||
    typeof quiz.updatedAt !== "number"
  ) {
    return null
  }
  return quiz
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
  quizzes: Record<string, Quiz>
} {
  const students = loadStudents()
  const quizIndex = loadQuizIndex()
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
  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as PersistedTimerState).configuredTotalSeconds !== "number" ||
    typeof (parsed as PersistedTimerState).remainingSeconds !== "number" ||
    typeof (parsed as PersistedTimerState).isRunning !== "boolean" ||
    typeof (parsed as PersistedTimerState).savedAt !== "number"
  ) {
    return null
  }
  const state = parsed as PersistedTimerState
  if (state.remainingSeconds <= 0) return null
  return state
}

export function saveTimer(state: PersistedTimerState) {
  if (typeof window === "undefined") return
  localStorage.setItem(TIMER_KEY, JSON.stringify(state))
}

export function clearTimer() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TIMER_KEY)
}
