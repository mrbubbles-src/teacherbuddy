import { normalizeStudentName } from "@/lib/students"

export type ImportedStudentRecord = {
  idHint: string | null
  name: string
}

export type ImportedClassRecord = {
  idHint: string | null
  className: string
  students: ImportedStudentRecord[]
}

export type ClassImportParseSuccess = {
  ok: true
  classes: ImportedClassRecord[]
  skippedClasses: number
  skippedStudents: number
}

export type ClassImportParseFailure = {
  ok: false
  error: string
}

export type ClassImportParseResult =
  | ClassImportParseSuccess
  | ClassImportParseFailure

/**
 * Normalizes class names by collapsing inner whitespace and trimming ends.
 * Use this before storing or comparing class names.
 */
export function normalizeClassName(name: string) {
  return name.replace(/\s+/g, " ").trim()
}

/**
 * Produces a stable, case-insensitive key for class name deduplication.
 * Accepts raw user input and returns a normalized lowercase key.
 */
export function classNameKey(name: string) {
  return normalizeClassName(name).toLocaleLowerCase()
}

/**
 * Parses class names from comma/newline-delimited text content.
 * Returns deduplicated class names in insertion order.
 */
export function parseClassNamesFromText(raw: string) {
  const names = raw
    .split(/[\n,]/)
    .map((entry) => normalizeClassName(entry))
    .filter(Boolean)
  return Array.from(new Set(names))
}

/**
 * Parses full class records from text lines.
 * Expected format per line: `Class Name: Student One, Student Two`.
 */
export function parseClassImportText(raw: string): ClassImportParseResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) {
    return {
      ok: false,
      error: "The text file is empty.",
    }
  }

  const classes: ImportedClassRecord[] = []
  let skippedClasses = 0
  let skippedStudents = 0

  for (const line of lines) {
    const separatorIndex = line.indexOf(":")
    if (separatorIndex < 0) {
      skippedClasses += 1
      continue
    }

    const className = normalizeClassName(line.slice(0, separatorIndex))
    if (!className) {
      skippedClasses += 1
      continue
    }

    const studentsRaw = line.slice(separatorIndex + 1)
    const students = studentsRaw
      .split(",")
      .map((entry) => normalizeStudentName(entry))
      .filter(Boolean)
      .map((name) => ({ idHint: null, name }))

    if (!students.length) {
      skippedClasses += 1
      continue
    }

    const uniqueStudents: ImportedStudentRecord[] = []
    const keys = new Set<string>()
    for (const student of students) {
      const key = student.name.toLocaleLowerCase()
      if (keys.has(key)) continue
      keys.add(key)
      uniqueStudents.push(student)
    }
    skippedStudents += students.length - uniqueStudents.length

    classes.push({
      idHint: null,
      className,
      students: uniqueStudents,
    })
  }

  if (!classes.length) {
    return {
      ok: false,
      error:
        "No valid classes were found. Use one line per class: Class Name: Student One, Student Two",
    }
  }

  return {
    ok: true,
    classes,
    skippedClasses,
    skippedStudents,
  }
}

type JsonClassInput = {
  classId?: string
  className?: string
  students?: Array<string | { id?: string; name?: string }>
}

/**
 * Parses class import JSON supporting one class object or an array of classes.
 * Accepts student entries as strings or `{ name, id? }` objects.
 */
export function parseClassImportJson(raw: string): ClassImportParseResult {
  let parsed: JsonClassInput | JsonClassInput[]
  try {
    parsed = JSON.parse(raw) as JsonClassInput | JsonClassInput[]
  } catch {
    return {
      ok: false,
      error: "Invalid JSON format. Check the file and try again.",
    }
  }

  const payload = Array.isArray(parsed) ? parsed : [parsed]
  if (!payload.length) {
    return {
      ok: false,
      error: "The JSON file is empty.",
    }
  }

  const classes: ImportedClassRecord[] = []
  let skippedClasses = 0
  let skippedStudents = 0

  for (const entry of payload) {
    if (!entry || typeof entry !== "object") {
      skippedClasses += 1
      continue
    }

    const candidate = entry as JsonClassInput
    const className = normalizeClassName(candidate.className ?? "")
    if (!className || !Array.isArray(candidate.students)) {
      skippedClasses += 1
      continue
    }

    const students: ImportedStudentRecord[] = []
    const studentKeys = new Set<string>()
    for (const studentEntry of candidate.students) {
      if (typeof studentEntry === "string") {
        const normalized = normalizeStudentName(studentEntry)
        if (!normalized) {
          skippedStudents += 1
          continue
        }
        const key = normalized.toLocaleLowerCase()
        if (studentKeys.has(key)) {
          skippedStudents += 1
          continue
        }
        studentKeys.add(key)
        students.push({ idHint: null, name: normalized })
        continue
      }

      if (!studentEntry || typeof studentEntry !== "object") {
        skippedStudents += 1
        continue
      }

      const normalized = normalizeStudentName(studentEntry.name ?? "")
      if (!normalized) {
        skippedStudents += 1
        continue
      }
      const idHint =
        typeof studentEntry.id === "string" && studentEntry.id.trim()
          ? studentEntry.id
          : null
      const key = normalized.toLocaleLowerCase()
      if (studentKeys.has(key)) {
        skippedStudents += 1
        continue
      }
      studentKeys.add(key)
      students.push({ idHint, name: normalized })
    }

    if (!students.length) {
      skippedClasses += 1
      continue
    }

    classes.push({
      idHint:
        typeof candidate.classId === "string" && candidate.classId.trim()
          ? candidate.classId
          : null,
      className,
      students,
    })
  }

  if (!classes.length) {
    return {
      ok: false,
      error: "No valid classes were found in this JSON file.",
    }
  }

  return {
    ok: true,
    classes,
    skippedClasses,
    skippedStudents,
  }
}
