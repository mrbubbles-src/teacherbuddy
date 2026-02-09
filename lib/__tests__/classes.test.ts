import { describe, expect, it } from "vitest"

import {
  classNameKey,
  normalizeClassName,
  parseClassImportJson,
  parseClassImportText,
  parseClassNamesFromText,
} from "@/lib/classes"

describe("normalizeClassName", () => {
  it("trims and collapses spaces", () => {
    expect(normalizeClassName("  Math   101  ")).toBe("Math 101")
  })
})

describe("classNameKey", () => {
  it("returns a lowercase normalized key", () => {
    expect(classNameKey("  Math   101  ")).toBe("math 101")
  })
})

describe("parseClassNamesFromText", () => {
  it("supports comma and newline separators", () => {
    expect(parseClassNamesFromText("Math 101,Science\nHistory")).toEqual([
      "Math 101",
      "Science",
      "History",
    ])
  })
})

describe("parseClassImportJson", () => {
  it("accepts a single class object", () => {
    const result = parseClassImportJson(
      JSON.stringify({
        classId: "class-1",
        className: "Math 101",
        students: ["Alex", { name: "Sam", id: "sam-1" }],
      })
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.classes).toHaveLength(1)
    expect(result.classes[0].students).toHaveLength(2)
  })

  it("accepts an array of classes", () => {
    const result = parseClassImportJson(
      JSON.stringify([
        { className: "Math", students: ["Alex"] },
        { className: "Science", students: ["Sam"] },
      ])
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.classes).toHaveLength(2)
  })

  it("skips classes with no valid students", () => {
    const result = parseClassImportJson(
      JSON.stringify({
        className: "Math",
        students: ["", "   "],
      })
    )

    expect(result.ok).toBe(false)
  })

  it("returns a failure for invalid json", () => {
    const result = parseClassImportJson("{")
    expect(result.ok).toBe(false)
  })
})

describe("parseClassImportText", () => {
  it("parses one class per line with students", () => {
    const result = parseClassImportText(
      "Math 101: Alex Johnson, Sam Lee\nScience 2B: Priya Patel, Omar Khan"
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.classes).toHaveLength(2)
    expect(result.classes[0].className).toBe("Math 101")
    expect(result.classes[0].students.map((entry) => entry.name)).toEqual([
      "Alex Johnson",
      "Sam Lee",
    ])
  })

  it("fails when format is invalid", () => {
    const result = parseClassImportText("Math 101")
    expect(result.ok).toBe(false)
  })

  it("skips invalid lines and keeps valid class lines", () => {
    const result = parseClassImportText(
      "Math 101: Alex, Sam\ninvalid-line\nScience: Priya"
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.classes).toHaveLength(2)
    expect(result.skippedClasses).toBe(1)
  })
})
