export function normalizeStudentName(name: string) {
  return name.replace(/\s+/g, " ").trim()
}

export function studentNameKey(name: string) {
  return normalizeStudentName(name).toLocaleLowerCase()
}

export function formatStudentName(name: string) {
  return normalizeStudentName(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
