import { describe, expect, it } from "vitest"

import {
  isBreakoutGroups,
  isPersistedTimerState,
  isProjectList,
  isQuestion,
  isQuiz,
  isQuizIndexEntry,
  isStudent,
} from "@/lib/type-guards"

describe("isStudent", () => {
  it("returns true for valid student object", () => {
    const validStudent = {
      id: "123",
      name: "John Doe",
      status: "active",
      createdAt: Date.now(),
    }
    expect(isStudent(validStudent)).toBe(true)
  })

  it("returns true for excluded status", () => {
    const excludedStudent = {
      id: "123",
      name: "John Doe",
      status: "excluded",
      createdAt: Date.now(),
    }
    expect(isStudent(excludedStudent)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isStudent(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isStudent(undefined)).toBe(false)
  })

  it("returns false for missing id", () => {
    const missingId = {
      name: "John Doe",
      status: "active",
      createdAt: Date.now(),
    }
    expect(isStudent(missingId)).toBe(false)
  })

  it("returns false for missing name", () => {
    const missingName = {
      id: "123",
      status: "active",
      createdAt: Date.now(),
    }
    expect(isStudent(missingName)).toBe(false)
  })

  it("returns false for missing status", () => {
    const missingStatus = {
      id: "123",
      name: "John Doe",
      createdAt: Date.now(),
    }
    expect(isStudent(missingStatus)).toBe(false)
  })

  it("returns false for missing createdAt", () => {
    const missingCreatedAt = {
      id: "123",
      name: "John Doe",
      status: "active",
    }
    expect(isStudent(missingCreatedAt)).toBe(false)
  })

  it("returns false for wrong id type", () => {
    const wrongIdType = {
      id: 123,
      name: "John Doe",
      status: "active",
      createdAt: Date.now(),
    }
    expect(isStudent(wrongIdType)).toBe(false)
  })

  it("returns false for wrong name type", () => {
    const wrongNameType = {
      id: "123",
      name: 456,
      status: "active",
      createdAt: Date.now(),
    }
    expect(isStudent(wrongNameType)).toBe(false)
  })

  it("returns false for wrong status type", () => {
    const wrongStatusType = {
      id: "123",
      name: "John Doe",
      status: 1,
      createdAt: Date.now(),
    }
    expect(isStudent(wrongStatusType)).toBe(false)
  })

  it("returns false for invalid status value", () => {
    const invalidStatus = {
      id: "123",
      name: "John Doe",
      status: "pending",
      createdAt: Date.now(),
    }
    expect(isStudent(invalidStatus)).toBe(false)
  })

  it("returns false for wrong createdAt type", () => {
    const wrongCreatedAtType = {
      id: "123",
      name: "John Doe",
      status: "active",
      createdAt: "2024-01-01",
    }
    expect(isStudent(wrongCreatedAtType)).toBe(false)
  })

  it("returns false for primitive types", () => {
    expect(isStudent("string")).toBe(false)
    expect(isStudent(123)).toBe(false)
    expect(isStudent(true)).toBe(false)
  })

  it("returns false for array", () => {
    expect(isStudent([])).toBe(false)
  })
})

describe("isQuestion", () => {
  it("returns true for valid question object", () => {
    const validQuestion = {
      id: "q1",
      prompt: "What is 2+2?",
      answer: "4",
    }
    expect(isQuestion(validQuestion)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isQuestion(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isQuestion(undefined)).toBe(false)
  })

  it("returns false for missing id", () => {
    const missingId = {
      prompt: "What is 2+2?",
      answer: "4",
    }
    expect(isQuestion(missingId)).toBe(false)
  })

  it("returns false for missing prompt", () => {
    const missingPrompt = {
      id: "q1",
      answer: "4",
    }
    expect(isQuestion(missingPrompt)).toBe(false)
  })

  it("returns false for missing answer", () => {
    const missingAnswer = {
      id: "q1",
      prompt: "What is 2+2?",
    }
    expect(isQuestion(missingAnswer)).toBe(false)
  })

  it("returns false for wrong id type", () => {
    const wrongIdType = {
      id: 1,
      prompt: "What is 2+2?",
      answer: "4",
    }
    expect(isQuestion(wrongIdType)).toBe(false)
  })

  it("returns false for wrong prompt type", () => {
    const wrongPromptType = {
      id: "q1",
      prompt: 123,
      answer: "4",
    }
    expect(isQuestion(wrongPromptType)).toBe(false)
  })

  it("returns false for wrong answer type", () => {
    const wrongAnswerType = {
      id: "q1",
      prompt: "What is 2+2?",
      answer: 4,
    }
    expect(isQuestion(wrongAnswerType)).toBe(false)
  })
})

describe("isQuizIndexEntry", () => {
  it("returns true for valid quiz index entry", () => {
    const validEntry = {
      id: "quiz1",
      title: "Math Quiz",
      createdAt: Date.now(),
    }
    expect(isQuizIndexEntry(validEntry)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isQuizIndexEntry(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isQuizIndexEntry(undefined)).toBe(false)
  })

  it("returns false for missing id", () => {
    const missingId = {
      title: "Math Quiz",
      createdAt: Date.now(),
    }
    expect(isQuizIndexEntry(missingId)).toBe(false)
  })

  it("returns false for missing title", () => {
    const missingTitle = {
      id: "quiz1",
      createdAt: Date.now(),
    }
    expect(isQuizIndexEntry(missingTitle)).toBe(false)
  })

  it("returns false for missing createdAt", () => {
    const missingCreatedAt = {
      id: "quiz1",
      title: "Math Quiz",
    }
    expect(isQuizIndexEntry(missingCreatedAt)).toBe(false)
  })

  it("returns false for wrong id type", () => {
    const wrongIdType = {
      id: 123,
      title: "Math Quiz",
      createdAt: Date.now(),
    }
    expect(isQuizIndexEntry(wrongIdType)).toBe(false)
  })

  it("returns false for wrong title type", () => {
    const wrongTitleType = {
      id: "quiz1",
      title: 456,
      createdAt: Date.now(),
    }
    expect(isQuizIndexEntry(wrongTitleType)).toBe(false)
  })

  it("returns false for wrong createdAt type", () => {
    const wrongCreatedAtType = {
      id: "quiz1",
      title: "Math Quiz",
      createdAt: "2024-01-01",
    }
    expect(isQuizIndexEntry(wrongCreatedAtType)).toBe(false)
  })
})

describe("isQuiz", () => {
  it("returns true for valid quiz object", () => {
    const validQuiz = {
      id: "quiz1",
      title: "Math Quiz",
      questions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(validQuiz)).toBe(true)
  })

  it("returns true for quiz with questions", () => {
    const quizWithQuestions = {
      id: "quiz1",
      title: "Math Quiz",
      questions: [{ id: "q1", prompt: "2+2?", answer: "4" }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(quizWithQuestions)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isQuiz(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isQuiz(undefined)).toBe(false)
  })

  it("returns false for missing id", () => {
    const missingId = {
      title: "Math Quiz",
      questions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(missingId)).toBe(false)
  })

  it("returns false for missing title", () => {
    const missingTitle = {
      id: "quiz1",
      questions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(missingTitle)).toBe(false)
  })

  it("returns false for missing questions", () => {
    const missingQuestions = {
      id: "quiz1",
      title: "Math Quiz",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(missingQuestions)).toBe(false)
  })

  it("returns false for missing createdAt", () => {
    const missingCreatedAt = {
      id: "quiz1",
      title: "Math Quiz",
      questions: [],
      updatedAt: Date.now(),
    }
    expect(isQuiz(missingCreatedAt)).toBe(false)
  })

  it("returns false for missing updatedAt", () => {
    const missingUpdatedAt = {
      id: "quiz1",
      title: "Math Quiz",
      questions: [],
      createdAt: Date.now(),
    }
    expect(isQuiz(missingUpdatedAt)).toBe(false)
  })

  it("returns false for questions not being array", () => {
    const questionsNotArray = {
      id: "quiz1",
      title: "Math Quiz",
      questions: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(questionsNotArray)).toBe(false)
  })

  it("returns false for wrong id type", () => {
    const wrongIdType = {
      id: 123,
      title: "Math Quiz",
      questions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(wrongIdType)).toBe(false)
  })

  it("returns false for wrong title type", () => {
    const wrongTitleType = {
      id: "quiz1",
      title: 456,
      questions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    expect(isQuiz(wrongTitleType)).toBe(false)
  })
})

describe("isBreakoutGroups", () => {
  it("returns true for valid breakout groups", () => {
    const validGroups = {
      groupSize: 3,
      groupIds: [
        ["id1", "id2", "id3"],
        ["id4", "id5", "id6"],
      ],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(validGroups)).toBe(true)
  })

  it("returns true for empty groupIds array", () => {
    const emptyGroupIds = {
      groupSize: 2,
      groupIds: [],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(emptyGroupIds)).toBe(true)
  })

  it("returns true for groupIds with empty arrays", () => {
    const groupIdsWithEmpty = {
      groupSize: 2,
      groupIds: [[], []],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(groupIdsWithEmpty)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isBreakoutGroups(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isBreakoutGroups(undefined)).toBe(false)
  })

  it("returns false for missing groupSize", () => {
    const missingGroupSize = {
      groupIds: [["id1", "id2"]],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(missingGroupSize)).toBe(false)
  })

  it("returns false for missing groupIds", () => {
    const missingGroupIds = {
      groupSize: 2,
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(missingGroupIds)).toBe(false)
  })

  it("returns false for missing createdAt", () => {
    const missingCreatedAt = {
      groupSize: 2,
      groupIds: [["id1", "id2"]],
    }
    expect(isBreakoutGroups(missingCreatedAt)).toBe(false)
  })

  it("returns false for wrong groupSize type", () => {
    const wrongGroupSizeType = {
      groupSize: "2",
      groupIds: [["id1", "id2"]],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(wrongGroupSizeType)).toBe(false)
  })

  it("returns false for groupIds not being array", () => {
    const groupIdsNotArray = {
      groupSize: 2,
      groupIds: {},
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(groupIdsNotArray)).toBe(false)
  })

  it("returns false for groupIds containing non-arrays", () => {
    const groupIdsContainingNonArrays = {
      groupSize: 2,
      groupIds: ["id1", "id2"],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(groupIdsContainingNonArrays)).toBe(false)
  })

  it("returns false for group containing non-string ids", () => {
    const groupWithNonStringIds = {
      groupSize: 2,
      groupIds: [[1, 2, 3]],
      createdAt: Date.now(),
    }
    expect(isBreakoutGroups(groupWithNonStringIds)).toBe(false)
  })

  it("returns false for wrong createdAt type", () => {
    const wrongCreatedAtType = {
      groupSize: 2,
      groupIds: [["id1", "id2"]],
      createdAt: "2024-01-01",
    }
    expect(isBreakoutGroups(wrongCreatedAtType)).toBe(false)
  })
})

describe("isProjectList", () => {
  it("returns true for valid project list", () => {
    const validProjectList = {
      id: "pl1",
      name: "Project Alpha",
      projectType: "group",
      studentIds: ["s1", "s2"],
      groups: [["s1"], ["s2"]],
    }
    expect(isProjectList(validProjectList)).toBe(true)
  })

  it("returns true for empty studentIds and groups", () => {
    const emptyArrays = {
      id: "pl1",
      name: "Project Alpha",
      projectType: "individual",
      studentIds: [],
      groups: [],
    }
    expect(isProjectList(emptyArrays)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isProjectList(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isProjectList(undefined)).toBe(false)
  })

  it("returns false for missing id", () => {
    const missingId = {
      name: "Project Alpha",
      projectType: "group",
      studentIds: ["s1"],
      groups: [],
    }
    expect(isProjectList(missingId)).toBe(false)
  })

  it("returns false for missing name", () => {
    const missingName = {
      id: "pl1",
      projectType: "group",
      studentIds: ["s1"],
      groups: [],
    }
    expect(isProjectList(missingName)).toBe(false)
  })

  it("returns false for missing projectType", () => {
    const missingProjectType = {
      id: "pl1",
      name: "Project Alpha",
      studentIds: ["s1"],
      groups: [],
    }
    expect(isProjectList(missingProjectType)).toBe(false)
  })

  it("returns false for missing studentIds", () => {
    const missingStudentIds = {
      id: "pl1",
      name: "Project Alpha",
      projectType: "group",
      groups: [],
    }
    expect(isProjectList(missingStudentIds)).toBe(false)
  })

  it("returns false for missing groups", () => {
    const missingGroups = {
      id: "pl1",
      name: "Project Alpha",
      projectType: "group",
      studentIds: ["s1"],
    }
    expect(isProjectList(missingGroups)).toBe(false)
  })

  it("returns false for studentIds not being array", () => {
    const studentIdsNotArray = {
      id: "pl1",
      name: "Project Alpha",
      projectType: "group",
      studentIds: {},
      groups: [],
    }
    expect(isProjectList(studentIdsNotArray)).toBe(false)
  })

  it("returns false for groups not being array", () => {
    const groupsNotArray = {
      id: "pl1",
      name: "Project Alpha",
      projectType: "group",
      studentIds: ["s1"],
      groups: {},
    }
    expect(isProjectList(groupsNotArray)).toBe(false)
  })

  it("returns false for wrong id type", () => {
    const wrongIdType = {
      id: 123,
      name: "Project Alpha",
      projectType: "group",
      studentIds: [],
      groups: [],
    }
    expect(isProjectList(wrongIdType)).toBe(false)
  })

  it("returns false for wrong name type", () => {
    const wrongNameType = {
      id: "pl1",
      name: 456,
      projectType: "group",
      studentIds: [],
      groups: [],
    }
    expect(isProjectList(wrongNameType)).toBe(false)
  })

  it("returns false for wrong projectType type", () => {
    const wrongProjectTypeType = {
      id: "pl1",
      name: "Project Alpha",
      projectType: 789,
      studentIds: [],
      groups: [],
    }
    expect(isProjectList(wrongProjectTypeType)).toBe(false)
  })
})

describe("isPersistedTimerState", () => {
  it("returns true for valid persisted timer state", () => {
    const validState = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: true,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(validState)).toBe(true)
  })

  it("returns true for timer not running", () => {
    const notRunningState = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: false,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(notRunningState)).toBe(true)
  })

  it("returns true for zero remaining seconds", () => {
    const zeroRemaining = {
      configuredTotalSeconds: 300,
      remainingSeconds: 0,
      isRunning: false,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(zeroRemaining)).toBe(true)
  })

  it("returns false for null", () => {
    expect(isPersistedTimerState(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isPersistedTimerState(undefined)).toBe(false)
  })

  it("returns false for missing configuredTotalSeconds", () => {
    const missingConfiguredTotalSeconds = {
      remainingSeconds: 150,
      isRunning: true,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(missingConfiguredTotalSeconds)).toBe(false)
  })

  it("returns false for missing remainingSeconds", () => {
    const missingRemainingSeconds = {
      configuredTotalSeconds: 300,
      isRunning: true,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(missingRemainingSeconds)).toBe(false)
  })

  it("returns false for missing isRunning", () => {
    const missingIsRunning = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(missingIsRunning)).toBe(false)
  })

  it("returns false for missing savedAt", () => {
    const missingSavedAt = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: true,
    }
    expect(isPersistedTimerState(missingSavedAt)).toBe(false)
  })

  it("returns false for wrong configuredTotalSeconds type", () => {
    const wrongConfiguredTotalSecondsType = {
      configuredTotalSeconds: "300",
      remainingSeconds: 150,
      isRunning: true,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(wrongConfiguredTotalSecondsType)).toBe(false)
  })

  it("returns false for wrong remainingSeconds type", () => {
    const wrongRemainingSecondsType = {
      configuredTotalSeconds: 300,
      remainingSeconds: "150",
      isRunning: true,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(wrongRemainingSecondsType)).toBe(false)
  })

  it("returns false for wrong isRunning type", () => {
    const wrongIsRunningType = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: 1,
      savedAt: Date.now(),
    }
    expect(isPersistedTimerState(wrongIsRunningType)).toBe(false)
  })

  it("returns false for wrong savedAt type", () => {
    const wrongSavedAtType = {
      configuredTotalSeconds: 300,
      remainingSeconds: 150,
      isRunning: true,
      savedAt: "2024-01-01",
    }
    expect(isPersistedTimerState(wrongSavedAtType)).toBe(false)
  })
})
