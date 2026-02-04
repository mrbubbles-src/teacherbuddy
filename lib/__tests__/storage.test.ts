import { beforeEach, describe, expect, it, vi } from "vitest"

import type { BreakoutGroups, Quiz, QuizIndexEntry, Student } from "@/lib/models"
import type { PersistedTimerState } from "@/lib/storage"
import {
  clearTimer,
  loadBreakoutGroups,
  loadPersistedState,
  loadQuiz,
  loadQuizIndex,
  loadStudents,
  loadTimer,
  removeQuiz,
  saveBreakoutGroups,
  saveQuiz,
  saveQuizIndex,
  saveStudents,
  saveTimer,
} from "@/lib/storage"

describe("loadStudents", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("returns empty array when no data", () => {
    expect(loadStudents()).toEqual([])
  })

  it("returns empty array for invalid JSON", () => {
    localStorage.setItem("teacherbuddy:students", "not valid json")
    expect(loadStudents()).toEqual([])
  })

  it("returns empty array for non-array data", () => {
    localStorage.setItem("teacherbuddy:students", '{"not": "an array"}')
    expect(loadStudents()).toEqual([])
  })

  it("filters out invalid student objects", () => {
    const mixedData = [
      { id: "1", name: "Valid", status: "active", createdAt: 1000 },
      { id: "2", name: "Missing Status", createdAt: 1000 },
      { invalid: "object" },
      null,
      "string",
    ]
    localStorage.setItem("teacherbuddy:students", JSON.stringify(mixedData))

    const result = loadStudents()
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Valid")
  })

  it("migrates legacy string array format", () => {
    const legacyData = ["John Doe", "Jane Smith"]
    localStorage.setItem("teacherbuddy:students", JSON.stringify(legacyData))

    const result = loadStudents()
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe("John Doe")
    expect(result[0].status).toBe("active")
    expect(result[0].id).toBeDefined()
    expect(result[0].createdAt).toBeDefined()
    expect(result[1].name).toBe("Jane Smith")
  })

  it("returns valid students from storage", () => {
    const students: Student[] = [
      { id: "1", name: "John Doe", status: "active", createdAt: 1000 },
      { id: "2", name: "Jane Smith", status: "excluded", createdAt: 2000 },
    ]
    localStorage.setItem("teacherbuddy:students", JSON.stringify(students))

    const result = loadStudents()
    expect(result).toEqual(students)
  })
})

describe("saveStudents", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("saves students to localStorage", () => {
    const students: Student[] = [
      { id: "1", name: "John Doe", status: "active", createdAt: 1000 },
    ]

    saveStudents(students)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "teacherbuddy:students",
      JSON.stringify(students)
    )
  })

  it("handles empty array", () => {
    saveStudents([])

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "teacherbuddy:students",
      "[]"
    )
  })
})

describe("loadQuizIndex", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("returns empty array when no data", () => {
    expect(loadQuizIndex()).toEqual([])
  })

  it("returns empty array for invalid JSON", () => {
    localStorage.setItem("teacherbuddy:quiz-index", "not valid json")
    expect(loadQuizIndex()).toEqual([])
  })

  it("returns empty array for non-array data", () => {
    localStorage.setItem("teacherbuddy:quiz-index", '{"not": "an array"}')
    expect(loadQuizIndex()).toEqual([])
  })

  it("filters out invalid entries", () => {
    const mixedData = [
      { id: "1", title: "Valid Quiz", createdAt: 1000 },
      { id: "2", title: "Missing createdAt" },
      { invalid: "entry" },
    ]
    localStorage.setItem("teacherbuddy:quiz-index", JSON.stringify(mixedData))

    const result = loadQuizIndex()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Valid Quiz")
  })

  it("returns valid quiz index entries", () => {
    const entries: QuizIndexEntry[] = [
      { id: "1", title: "Quiz 1", createdAt: 1000 },
      { id: "2", title: "Quiz 2", createdAt: 2000 },
    ]
    localStorage.setItem("teacherbuddy:quiz-index", JSON.stringify(entries))

    expect(loadQuizIndex()).toEqual(entries)
  })
})

describe("saveQuizIndex", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("saves quiz index to localStorage", () => {
    const entries: QuizIndexEntry[] = [
      { id: "1", title: "Quiz 1", createdAt: 1000 },
    ]

    saveQuizIndex(entries)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "teacherbuddy:quiz-index",
      JSON.stringify(entries)
    )
  })
})

describe("loadQuiz", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("returns null when no data", () => {
    expect(loadQuiz("nonexistent")).toBeNull()
  })

  it("returns null for invalid JSON", () => {
    localStorage.setItem("teacherbuddy:quiz:test", "not valid json")
    expect(loadQuiz("test")).toBeNull()
  })

  it("returns null for invalid quiz", () => {
    const invalidQuiz = { id: "1", title: "Missing fields" }
    localStorage.setItem("teacherbuddy:quiz:1", JSON.stringify(invalidQuiz))

    expect(loadQuiz("1")).toBeNull()
  })

  it("returns valid quiz from storage", () => {
    const quiz: Quiz = {
      id: "1",
      title: "Math Quiz",
      questions: [{ id: "q1", prompt: "2+2?", answer: "4" }],
      createdAt: 1000,
      updatedAt: 2000,
    }
    localStorage.setItem("teacherbuddy:quiz:1", JSON.stringify(quiz))

    expect(loadQuiz("1")).toEqual(quiz)
  })
})

describe("saveQuiz", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("saves quiz with correct key", () => {
    const quiz: Quiz = {
      id: "test-quiz",
      title: "Test Quiz",
      questions: [],
      createdAt: 1000,
      updatedAt: 2000,
    }

    saveQuiz(quiz)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "teacherbuddy:quiz:test-quiz",
      JSON.stringify(quiz)
    )
  })
})

describe("removeQuiz", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("removes quiz from storage", () => {
    removeQuiz("test-quiz")

    expect(localStorage.removeItem).toHaveBeenCalledWith(
      "teacherbuddy:quiz:test-quiz"
    )
  })
})

describe("loadBreakoutGroups", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("returns null when no data", () => {
    expect(loadBreakoutGroups()).toBeNull()
  })

  it("returns null for invalid JSON", () => {
    localStorage.setItem("teacherbuddy:breakout-groups", "not valid json")
    expect(loadBreakoutGroups()).toBeNull()
  })

  it("returns null for invalid breakout groups", () => {
    const invalid = { groupSize: 2 } // missing groupIds and createdAt
    localStorage.setItem("teacherbuddy:breakout-groups", JSON.stringify(invalid))

    expect(loadBreakoutGroups()).toBeNull()
  })

  it("validates groupIds structure", () => {
    const invalidGroupIds = {
      groupSize: 2,
      groupIds: "not an array",
      createdAt: 1000,
    }
    localStorage.setItem(
      "teacherbuddy:breakout-groups",
      JSON.stringify(invalidGroupIds)
    )

    expect(loadBreakoutGroups()).toBeNull()
  })

  it("returns valid breakout groups", () => {
    const groups: BreakoutGroups = {
      groupSize: 3,
      groupIds: [
        ["id1", "id2", "id3"],
        ["id4", "id5"],
      ],
      createdAt: 1000,
    }
    localStorage.setItem("teacherbuddy:breakout-groups", JSON.stringify(groups))

    expect(loadBreakoutGroups()).toEqual(groups)
  })
})

describe("saveBreakoutGroups", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("saves breakout groups to localStorage", () => {
    const groups: BreakoutGroups = {
      groupSize: 3,
      groupIds: [["id1", "id2", "id3"]],
      createdAt: 1000,
    }

    saveBreakoutGroups(groups)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "teacherbuddy:breakout-groups",
      JSON.stringify(groups)
    )
  })

  it("removes breakout groups when null", () => {
    saveBreakoutGroups(null)

    expect(localStorage.removeItem).toHaveBeenCalledWith(
      "teacherbuddy:breakout-groups"
    )
  })
})

describe("loadTimer", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("returns null when no data", () => {
    expect(loadTimer()).toBeNull()
  })

  it("returns null for invalid JSON", () => {
    localStorage.setItem("teacherbuddy:timer", "not valid json")
    expect(loadTimer()).toBeNull()
  })

  it("returns null for invalid timer state", () => {
    const invalid = { configuredTotalSeconds: 300 } // missing other fields
    localStorage.setItem("teacherbuddy:timer", JSON.stringify(invalid))

    expect(loadTimer()).toBeNull()
  })

  it("returns null when remainingSeconds <= 0", () => {
    const expiredTimer: PersistedTimerState = {
      configuredTotalSeconds: 300,
      remainingSeconds: 0,
      isRunning: false,
      savedAt: Date.now(),
    }
    localStorage.setItem("teacherbuddy:timer", JSON.stringify(expiredTimer))

    expect(loadTimer()).toBeNull()
  })

  it("returns null when remainingSeconds is negative", () => {
    const negativeTimer: PersistedTimerState = {
      configuredTotalSeconds: 300,
      remainingSeconds: -10,
      isRunning: false,
      savedAt: Date.now(),
    }
    localStorage.setItem("teacherbuddy:timer", JSON.stringify(negativeTimer))

    expect(loadTimer()).toBeNull()
  })

  it("returns valid timer state", () => {
    const timerState: PersistedTimerState = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: true,
      savedAt: 1000,
    }
    localStorage.setItem("teacherbuddy:timer", JSON.stringify(timerState))

    expect(loadTimer()).toEqual(timerState)
  })
})

describe("saveTimer", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("saves timer state correctly", () => {
    const timerState: PersistedTimerState = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: true,
      savedAt: 1000,
    }

    saveTimer(timerState)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "teacherbuddy:timer",
      JSON.stringify(timerState)
    )
  })
})

describe("clearTimer", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("clears timer from storage", () => {
    clearTimer()

    expect(localStorage.removeItem).toHaveBeenCalledWith("teacherbuddy:timer")
  })
})

describe("loadPersistedState", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("loads all persisted data", () => {
    const students: Student[] = [
      { id: "s1", name: "John", status: "active", createdAt: 1000 },
    ]
    const quizIndex: QuizIndexEntry[] = [
      { id: "q1", title: "Quiz 1", createdAt: 1000 },
    ]
    const quiz: Quiz = {
      id: "q1",
      title: "Quiz 1",
      questions: [],
      createdAt: 1000,
      updatedAt: 1000,
    }
    const breakoutGroups: BreakoutGroups = {
      groupSize: 2,
      groupIds: [["s1"]],
      createdAt: 1000,
    }

    localStorage.setItem("teacherbuddy:students", JSON.stringify(students))
    localStorage.setItem("teacherbuddy:quiz-index", JSON.stringify(quizIndex))
    localStorage.setItem("teacherbuddy:quiz:q1", JSON.stringify(quiz))
    localStorage.setItem(
      "teacherbuddy:breakout-groups",
      JSON.stringify(breakoutGroups)
    )

    const result = loadPersistedState()

    expect(result.students).toEqual(students)
    expect(result.quizIndex).toEqual(quizIndex)
    expect(result.quizzes).toEqual({ q1: quiz })
    expect(result.breakoutGroups).toEqual(breakoutGroups)
  })

  it("cleans orphaned quiz index entries", () => {
    const quizIndex: QuizIndexEntry[] = [
      { id: "exists", title: "Exists", createdAt: 1000 },
      { id: "orphaned", title: "Orphaned", createdAt: 2000 },
    ]
    const quiz: Quiz = {
      id: "exists",
      title: "Exists",
      questions: [],
      createdAt: 1000,
      updatedAt: 1000,
    }

    localStorage.setItem("teacherbuddy:quiz-index", JSON.stringify(quizIndex))
    localStorage.setItem("teacherbuddy:quiz:exists", JSON.stringify(quiz))
    // Note: "orphaned" quiz is NOT in storage

    const result = loadPersistedState()

    expect(result.quizIndex).toHaveLength(1)
    expect(result.quizIndex[0].id).toBe("exists")
    expect(Object.keys(result.quizzes)).toEqual(["exists"])
  })

  it("returns empty structures when nothing stored", () => {
    const result = loadPersistedState()

    expect(result.students).toEqual([])
    expect(result.quizIndex).toEqual([])
    expect(result.quizzes).toEqual({})
    expect(result.breakoutGroups).toBeNull()
    expect(result.projectLists).toEqual([])
  })
})
