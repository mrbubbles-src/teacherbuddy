import type {
  BreakoutGroups,
  Classroom,
  ProjectList,
  Quiz,
  QuizIndexEntry,
  Student,
} from "@/lib/models"
import {
  isBreakoutGroups,
  isClassroom,
  isPersistedTimerState,
  isProjectList,
  isQuiz,
  isQuizIndexEntry,
  isStudent,
} from "@/lib/type-guards"

const CLASSES_KEY = "teacherbuddy:classes"
const ACTIVE_CLASS_KEY = "teacherbuddy:active-class"
const STUDENTS_KEY = "teacherbuddy:students"
const QUIZ_INDEX_KEY = "teacherbuddy:quiz-index"
const PROJECT_LISTS_KEY = "teacherbuddy:project-lists"
const BREAKOUT_GROUPS_KEY = "teacherbuddy:breakout-groups"
const TIMER_KEY = "teacherbuddy:timer"
const TIMER_FAVORITES_KEY = "teacherbuddy:timer-favorites"
const PRIVACY_NOTICE_ACK_KEY = "teacherbuddy:privacy-notice-acknowledged"

const DEFAULT_CLASS_NAME = "Class 1"

const quizKey = (id: string) => `teacherbuddy:quiz:${id}`

export type PersistedTimerState = {
  configuredTotalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  savedAt: number
}

export type LoadedPersistedState = {
  classes: Classroom[]
  activeClassId: string | null
  students: Student[]
  quizIndex: QuizIndexEntry[]
  projectLists: ProjectList[]
  breakoutGroupsByClass: Record<string, BreakoutGroups>
  quizzes: Record<string, Quiz>
}

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
type JsonObject = { [key: string]: JsonValue }

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.error("Failed to parse localStorage payload", error)
    return fallback
  }
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function isLegacyStudentObject(value: JsonValue): boolean {
  if (!isJsonObject(value)) return false
  const status = value.status
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (status === "active" || status === "excluded") &&
    typeof value.createdAt === "number" &&
    typeof value.classId !== "string"
  )
}

function isLegacyProjectListObject(value: JsonValue): boolean {
  if (!isJsonObject(value)) return false
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.projectType === "string" &&
    Array.isArray(value.studentIds) &&
    Array.isArray(value.groups) &&
    typeof value.classId !== "string"
  )
}

function isLegacyBreakoutObject(value: JsonValue | null): boolean {
  if (!value || !isJsonObject(value)) return false
  return (
    typeof value.groupSize === "number" &&
    Array.isArray(value.groupIds) &&
    typeof value.createdAt === "number" &&
    typeof value.classId !== "string"
  )
}

function createDefaultClass(): Classroom {
  return {
    id: crypto.randomUUID(),
    name: DEFAULT_CLASS_NAME,
    createdAt: Date.now(),
  }
}

function parseStudents(
  raw: JsonValue[],
  fallbackClassId: string | null
): Student[] {
  const students: Student[] = []

  for (const entry of raw) {
    if (typeof entry === "string") {
      if (!fallbackClassId) continue
      students.push({
        id: crypto.randomUUID(),
        name: entry,
        status: "active",
        createdAt: Date.now(),
        classId: fallbackClassId,
      })
      continue
    }

    if (isStudent(entry)) {
      students.push(entry)
      continue
    }

    if (!fallbackClassId || !isLegacyStudentObject(entry)) {
      continue
    }
    const legacy = entry as JsonObject

    students.push({
      id: legacy.id as string,
      name: legacy.name as string,
      status: legacy.status as Student["status"],
      createdAt: legacy.createdAt as number,
      classId: fallbackClassId,
    })
  }

  return students
}

function parseProjectLists(
  raw: JsonValue[],
  fallbackClassId: string | null
): ProjectList[] {
  const projectLists: ProjectList[] = []

  for (const entry of raw) {
    if (isProjectList(entry)) {
      const record = entry as ProjectList & { description?: string }
      projectLists.push({
        ...record,
        description: record.description ?? "",
        createdAt:
          typeof record.createdAt === "number" ? record.createdAt : Date.now(),
      })
      continue
    }

    if (!fallbackClassId || !isLegacyProjectListObject(entry)) {
      continue
    }
    const legacy = entry as JsonObject

    const groups = (legacy.groups as JsonValue[])
      .filter((group) => Array.isArray(group))
      .map((group) =>
        (group as JsonValue[])
          .filter((id) => typeof id === "string")
          .map((id) => id as string)
      )

    const studentIds = (legacy.studentIds as JsonValue[])
      .filter((id) => typeof id === "string")
      .map((id) => id as string)

    projectLists.push({
      id: legacy.id as string,
      classId: fallbackClassId,
      name: legacy.name as string,
      projectType: legacy.projectType as string,
      description:
        typeof legacy.description === "string" ? (legacy.description as string) : "",
      studentIds,
      groups,
      createdAt:
        typeof legacy.createdAt === "number" ? (legacy.createdAt as number) : Date.now(),
    })
  }

  return projectLists
}

function parseBreakoutGroupsByClass(
  raw: JsonValue | null,
  fallbackClassId: string | null
): Record<string, BreakoutGroups> {
  if (!raw) return {}

  if (isBreakoutGroups(raw)) {
    return { [raw.classId]: raw }
  }

  if (isLegacyBreakoutObject(raw) && fallbackClassId) {
    const legacy = raw as JsonObject
    return {
      [fallbackClassId]: {
        classId: fallbackClassId,
        groupSize: legacy.groupSize as number,
        groupIds: (legacy.groupIds as JsonValue[])
          .filter((group) => Array.isArray(group))
          .map((group) =>
            (group as JsonValue[])
              .filter((id) => typeof id === "string")
              .map((id) => id as string)
          ),
        createdAt: legacy.createdAt as number,
      },
    }
  }

  if (!isJsonObject(raw)) return {}

  const groupsByClass: Record<string, BreakoutGroups> = {}
  for (const [classId, value] of Object.entries(raw)) {
    if (!classId || !isBreakoutGroups(value)) continue
    groupsByClass[classId] = value
  }

  return groupsByClass
}

function ensureClassesForStudents(
  classes: Classroom[],
  students: Student[]
): Classroom[] {
  const knownIds = new Set(classes.map((entry) => entry.id))
  const nextClasses = [...classes]

  for (const student of students) {
    if (knownIds.has(student.classId)) continue
    knownIds.add(student.classId)
    nextClasses.push({
      id: student.classId,
      name: `Class ${nextClasses.length + 1}`,
      createdAt: Date.now(),
    })
  }

  return nextClasses
}

/**
 * Loads class definitions from local storage.
 * Filters invalid entries and returns an empty array on failure.
 */
export function loadClasses(): Classroom[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<JsonValue[]>(localStorage.getItem(CLASSES_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter((entry) => isClassroom(entry))
}

/**
 * Persists class records to local storage.
 * Accepts normalized class objects from app state.
 */
export function saveClasses(classes: Classroom[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes))
}

/**
 * Loads the active class ID from local storage.
 * Returns null when missing or invalid.
 */
export function loadActiveClassId(): string | null {
  if (typeof window === "undefined") return null
  const parsed = safeParse<JsonValue | null>(
    localStorage.getItem(ACTIVE_CLASS_KEY),
    null
  )
  return typeof parsed === "string" ? parsed : null
}

/**
 * Persists the active class ID to local storage.
 * Clears the key when null.
 */
export function saveActiveClassId(activeClassId: string | null) {
  if (typeof window === "undefined") return
  if (!activeClassId) {
    localStorage.removeItem(ACTIVE_CLASS_KEY)
    return
  }
  localStorage.setItem(ACTIVE_CLASS_KEY, JSON.stringify(activeClassId))
}

/**
 * Loads students from local storage and normalizes legacy payload formats.
 * Returns an empty array when unavailable, invalid, or running on the server.
 */
export function loadStudents(defaultClassId: string | null = null): Student[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<JsonValue[]>(localStorage.getItem(STUDENTS_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parseStudents(parsed, defaultClassId)
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
  const parsed = safeParse<JsonValue[]>(localStorage.getItem(QUIZ_INDEX_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter((entry) => isQuizIndexEntry(entry))
}

/**
 * Loads saved project lists from local storage with backward-compatible defaults.
 * Ensures each list contains description and createdAt values.
 */
export function loadProjectLists(defaultClassId: string | null = null): ProjectList[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<JsonValue[]>(localStorage.getItem(PROJECT_LISTS_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parseProjectLists(parsed, defaultClassId)
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
 * Loads persisted breakout group assignments for all classes from local storage.
 * Migrates legacy single-breakout payloads when needed.
 */
export function loadBreakoutGroupsByClass(
  defaultClassId: string | null = null
): Record<string, BreakoutGroups> {
  if (typeof window === "undefined") return {}
  const parsed = safeParse<JsonValue | null>(
    localStorage.getItem(BREAKOUT_GROUPS_KEY),
    null
  )
  return parseBreakoutGroupsByClass(parsed, defaultClassId)
}

/**
 * Persists breakout group assignments keyed by class ID.
 * Clears storage when the provided map is empty.
 */
export function saveBreakoutGroupsByClass(
  groupsByClass: Record<string, BreakoutGroups>
) {
  if (typeof window === "undefined") return
  if (!Object.keys(groupsByClass).length) {
    localStorage.removeItem(BREAKOUT_GROUPS_KEY)
    return
  }
  localStorage.setItem(BREAKOUT_GROUPS_KEY, JSON.stringify(groupsByClass))
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
  const parsed = safeParse<JsonValue | null>(localStorage.getItem(quizKey(id)), null)
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
 * Migrates legacy storage payloads into class-aware structures.
 */
export function loadPersistedState(): LoadedPersistedState {
  const rawStudents = safeParse<JsonValue[]>(
    typeof window === "undefined" ? null : localStorage.getItem(STUDENTS_KEY),
    []
  )
  const rawProjectLists = safeParse<JsonValue[]>(
    typeof window === "undefined"
      ? null
      : localStorage.getItem(PROJECT_LISTS_KEY),
    []
  )
  const rawBreakout = safeParse<JsonValue | null>(
    typeof window === "undefined"
      ? null
      : localStorage.getItem(BREAKOUT_GROUPS_KEY),
    null
  )

  let classes = loadClasses()
  if (!classes.length) {
    classes = [createDefaultClass()]
  }

  const fallbackClassId = classes[0]?.id ?? null
  const students = parseStudents(rawStudents, fallbackClassId)
  classes = ensureClassesForStudents(classes, students)

  const projectLists = parseProjectLists(rawProjectLists, fallbackClassId).filter((list) =>
    classes.some((entry) => entry.id === list.classId)
  )

  const breakoutGroupsByClass = parseBreakoutGroupsByClass(
    rawBreakout,
    fallbackClassId
  )

  const cleanedBreakoutGroupsByClass: Record<string, BreakoutGroups> = {}
  for (const [classId, groups] of Object.entries(breakoutGroupsByClass)) {
    if (!classes.some((entry) => entry.id === classId)) continue
    cleanedBreakoutGroupsByClass[classId] = groups
  }

  const rawActiveClassId = loadActiveClassId()
  const activeClassId =
    rawActiveClassId && classes.some((entry) => entry.id === rawActiveClassId)
      ? rawActiveClassId
      : (classes[0]?.id ?? null)

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
    classes,
    activeClassId,
    students,
    quizIndex: cleanedIndex,
    projectLists,
    breakoutGroupsByClass: cleanedBreakoutGroupsByClass,
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
  const parsed = safeParse<JsonValue | null>(localStorage.getItem(TIMER_KEY), null)
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

/**
 * Loads the user's favorite timer preset values (in seconds) from localStorage.
 * Returns the default set [60, 300, 900] when nothing is stored or data is invalid.
 * Allows 0–3 favorites.
 */
export function loadTimerFavorites(): number[] {
  if (typeof window === "undefined") return [60, 300, 900]
  const parsed = safeParse<JsonValue | null>(
    localStorage.getItem(TIMER_FAVORITES_KEY),
    null
  )
  if (
    !Array.isArray(parsed) ||
    parsed.length > 3 ||
    !parsed.every((v) => typeof v === "number" && v > 0)
  ) {
    return [60, 300, 900]
  }
  return parsed as number[]
}

/**
 * Persists the user's favorite timer preset values (in seconds).
 * Accepts 0–3 positive numbers.
 */
export function saveTimerFavorites(favorites: number[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TIMER_FAVORITES_KEY, JSON.stringify(favorites))
}
