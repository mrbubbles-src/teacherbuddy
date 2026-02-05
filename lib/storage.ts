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
const PRIVACY_NOTICE_ACK_KEY = "teacherbuddy:privacy-notice-acknowledged"

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

/**
 * Loads students from local storage and normalizes legacy string-array data.
 * Returns an empty array when unavailable, invalid, or running on the server.
 */
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

/**
 * Persists the full student roster to local storage.
 * Accepts normalized student records from app state.
 */
export function saveStudents(students: Student[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

/**
 * Loads quiz index entries from local storage.
 * Filters out invalid entries and returns an empty array on failure.
 */
export function loadQuizIndex(): QuizIndexEntry[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<unknown>(localStorage.getItem(QUIZ_INDEX_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isQuizIndexEntry)
}

/**
 * Loads saved project lists from local storage with backward-compatible defaults.
 * Ensures each list contains description and createdAt values.
 */
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

/**
 * Persists project list records to local storage.
 * Overwrites any existing project list payload.
 */
export function saveProjectLists(lists: ProjectList[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(PROJECT_LISTS_KEY, JSON.stringify(lists))
}

/**
 * Loads persisted breakout group assignments from local storage.
 * Returns `null` when data is missing or invalid.
 */
export function loadBreakoutGroups(): BreakoutGroups | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(BREAKOUT_GROUPS_KEY), null)
  if (!isBreakoutGroups(parsed)) return null
  return parsed
}

/**
 * Persists breakout group assignments, or clears them when `null`.
 * Used by breakout workflow to retain the latest generated groups.
 */
export function saveBreakoutGroups(groups: BreakoutGroups | null) {
  if (typeof window === "undefined") return
  if (!groups) {
    localStorage.removeItem(BREAKOUT_GROUPS_KEY)
    return
  }
  localStorage.setItem(BREAKOUT_GROUPS_KEY, JSON.stringify(groups))
}

/**
 * Persists the quiz index used for selector lists.
 * Accepts already-sorted quiz index entries.
 */
export function saveQuizIndex(index: QuizIndexEntry[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(QUIZ_INDEX_KEY, JSON.stringify(index))
}

/**
 * Loads a single quiz by ID from local storage.
 * Returns `null` when the quiz does not exist or fails validation.
 */
export function loadQuiz(id: string): Quiz | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(quizKey(id)), null)
  if (!isQuiz(parsed)) return null
  return parsed
}

/**
 * Persists a single quiz payload using its ID-scoped storage key.
 * Expects a complete quiz object including questions and timestamps.
 */
export function saveQuiz(quiz: Quiz) {
  if (typeof window === "undefined") return
  localStorage.setItem(quizKey(quiz.id), JSON.stringify(quiz))
}

/**
 * Deletes a stored quiz by ID.
 * No-op on the server or when the key is missing.
 */
export function removeQuiz(id: string) {
  if (typeof window === "undefined") return
  localStorage.removeItem(quizKey(id))
}

/**
 * Loads all persisted application data and removes broken quiz references.
 * Returns students, quiz index, quiz map, project lists, and breakout groups.
 */
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

/**
 * Synchronizes stored quiz payloads with the current quiz index.
 * Saves indexed quizzes and removes stale quiz keys not present in the index.
 */
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

/**
 * Loads persisted timer state for the quiz timer.
 * Returns `null` for invalid data or completed timers.
 */
export function loadTimer(): PersistedTimerState | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<unknown>(localStorage.getItem(TIMER_KEY), null)
  if (!isPersistedTimerState(parsed)) return null
  if (parsed.remainingSeconds <= 0) return null
  return parsed
}

/**
 * Persists current quiz timer state to local storage.
 * Call while timer is configured or actively running.
 */
export function saveTimer(state: PersistedTimerState) {
  if (typeof window === "undefined") return
  localStorage.setItem(TIMER_KEY, JSON.stringify(state))
}

/**
 * Clears any persisted quiz timer state.
 * Used when timer resets or completes.
 */
export function clearTimer() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TIMER_KEY)
}

/**
 * Returns whether the user has acknowledged the privacy/local-storage notice.
 * Used to avoid showing the notice again until local storage is cleared.
 */
export function isPrivacyNoticeAcknowledged(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(PRIVACY_NOTICE_ACK_KEY) === "1"
}

/**
 * Marks the privacy notice as acknowledged so it is not shown again.
 */
export function setPrivacyNoticeAcknowledged(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PRIVACY_NOTICE_ACK_KEY, "1")
}
