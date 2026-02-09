import type {
  BreakoutGroups,
  ProjectList,
  Question,
  Quiz,
  QuizIndexEntry,
  Student,
} from "@/lib/models"
import type { PersistedTimerState } from "@/lib/storage"

/**
 * Checks whether a value matches the persisted `Student` shape.
 * Use before trusting untyped storage payloads.
 */
export function isStudent(value: unknown): value is Student {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.status === "string" &&
    (obj.status === "active" || obj.status === "excluded") &&
    typeof obj.createdAt === "number"
  )
}

/**
 * Checks whether a value matches a quiz `Question` record.
 * Validates id, prompt, and answer as strings.
 */
export function isQuestion(value: unknown): value is Question {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.prompt === "string" &&
    typeof obj.answer === "string"
  )
}

/**
 * Checks whether a value matches a `QuizIndexEntry`.
 * Ensures id/title strings and numeric creation timestamp.
 */
export function isQuizIndexEntry(value: unknown): value is QuizIndexEntry {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.createdAt === "number"
  )
}

/**
 * Checks whether a value matches a full `Quiz` payload.
 * Verifies top-level fields and timestamps used by persistence.
 */
export function isQuiz(value: unknown): value is Quiz {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    (obj.description === undefined || typeof obj.description === "string") &&
    Array.isArray(obj.questions) &&
    typeof obj.createdAt === "number" &&
    typeof obj.updatedAt === "number"
  )
}

/**
 * Checks whether a value matches persisted breakout group data.
 * Ensures group size, group ID arrays, and creation timestamp are valid.
 */
export function isBreakoutGroups(value: unknown): value is BreakoutGroups {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  if (
    typeof obj.groupSize !== "number" ||
    !Array.isArray(obj.groupIds) ||
    typeof obj.createdAt !== "number"
  ) {
    return false
  }
  return obj.groupIds.every(
    (group) =>
      Array.isArray(group) && group.every((id) => typeof id === "string")
  )
}

/**
 * Checks whether a value matches a stored `ProjectList` payload.
 * Validates required scalar fields and student/group collections.
 */
export function isProjectList(value: unknown): value is ProjectList {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.projectType === "string" &&
    Array.isArray(obj.studentIds) &&
    Array.isArray(obj.groups)
  )
}

/**
 * Checks whether a value matches persisted quiz timer state.
 * Used before restoring countdown values from local storage.
 */
export function isPersistedTimerState(
  value: unknown
): value is PersistedTimerState {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.configuredTotalSeconds === "number" &&
    typeof obj.remainingSeconds === "number" &&
    typeof obj.isRunning === "boolean" &&
    typeof obj.savedAt === "number"
  )
}
