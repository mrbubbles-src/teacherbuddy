/**
 * Normalizes student name spacing by collapsing inner whitespace and trimming ends.
 * Use before comparisons or persistence to keep naming consistent.
 */
export function normalizeStudentName(name: string) {
  return name.replace(/\s+/g, " ").trim()
}

/**
 * Builds a case-insensitive key for student name deduplication.
 * Accepts raw input and returns a normalized lowercase identifier.
 */
export function studentNameKey(name: string) {
  return normalizeStudentName(name).toLocaleLowerCase()
}

/**
 * Formats a student name into title case for display.
 * Splits by spaces, capitalizes each token, and rejoins with single spaces.
 */
export function formatStudentName(name: string) {
  return normalizeStudentName(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
