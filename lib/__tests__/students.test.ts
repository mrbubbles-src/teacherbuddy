import { describe, expect, it } from "vitest"

import {
  formatStudentName,
  normalizeStudentName,
  studentNameKey,
} from "@/lib/students"

describe("normalizeStudentName", () => {
  it("trims leading whitespace", () => {
    expect(normalizeStudentName("  John Doe")).toBe("John Doe")
  })

  it("trims trailing whitespace", () => {
    expect(normalizeStudentName("John Doe  ")).toBe("John Doe")
  })

  it("trims leading and trailing whitespace", () => {
    expect(normalizeStudentName("  John Doe  ")).toBe("John Doe")
  })

  it("collapses multiple spaces to single space", () => {
    expect(normalizeStudentName("John   Doe")).toBe("John Doe")
  })

  it("collapses multiple spaces and trims", () => {
    expect(normalizeStudentName("  John   Doe  ")).toBe("John Doe")
  })

  it("handles empty string", () => {
    expect(normalizeStudentName("")).toBe("")
  })

  it("handles whitespace only string", () => {
    expect(normalizeStudentName("   ")).toBe("")
  })

  it("handles tabs and newlines", () => {
    expect(normalizeStudentName("John\tDoe")).toBe("John Doe")
    expect(normalizeStudentName("John\nDoe")).toBe("John Doe")
  })

  it("handles single word", () => {
    expect(normalizeStudentName("John")).toBe("John")
  })

  it("handles multiple words", () => {
    expect(normalizeStudentName("John Michael Doe")).toBe("John Michael Doe")
  })

  it("preserves case", () => {
    expect(normalizeStudentName("jOHN DOE")).toBe("jOHN DOE")
  })
})

describe("studentNameKey", () => {
  it("returns lowercase", () => {
    expect(studentNameKey("John Doe")).toBe("john doe")
  })

  it("normalizes whitespace before lowercasing", () => {
    expect(studentNameKey("  John   Doe  ")).toBe("john doe")
  })

  it("handles empty string", () => {
    expect(studentNameKey("")).toBe("")
  })

  it("handles mixed case", () => {
    expect(studentNameKey("jOHN DOE")).toBe("john doe")
  })

  it("handles single word", () => {
    expect(studentNameKey("JOHN")).toBe("john")
  })

  it("produces same key for different cases", () => {
    expect(studentNameKey("John Doe")).toBe(studentNameKey("JOHN DOE"))
    expect(studentNameKey("john doe")).toBe(studentNameKey("JOHN DOE"))
  })

  it("produces same key for different whitespace", () => {
    expect(studentNameKey("John Doe")).toBe(studentNameKey("  john   doe  "))
  })
})

describe("formatStudentName", () => {
  it("capitalizes first letter of each word", () => {
    expect(formatStudentName("john doe")).toBe("John Doe")
  })

  it("handles single word", () => {
    expect(formatStudentName("john")).toBe("John")
  })

  it("handles multiple words", () => {
    expect(formatStudentName("john michael doe")).toBe("John Michael Doe")
  })

  it("handles empty string", () => {
    expect(formatStudentName("")).toBe("")
  })

  it("handles whitespace only string", () => {
    expect(formatStudentName("   ")).toBe("")
  })

  it("normalizes whitespace", () => {
    expect(formatStudentName("  john   doe  ")).toBe("John Doe")
  })

  it("handles already capitalized names", () => {
    expect(formatStudentName("John Doe")).toBe("John Doe")
  })

  it("handles all uppercase names", () => {
    expect(formatStudentName("JOHN DOE")).toBe("JOHN DOE")
  })

  it("preserves characters after first in each word", () => {
    expect(formatStudentName("mCdonald")).toBe("MCdonald")
  })

  it("handles names with special characters", () => {
    expect(formatStudentName("o'brien")).toBe("O'brien")
  })
})
