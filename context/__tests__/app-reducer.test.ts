import { act, renderHook } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppStoreProvider, useAppStore } from "@/context/app-store"

// Helper to create a wrapper for testing
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(AppStoreProvider, null, children)
  }
}

// Helper to render hook with provider
function renderAppStore() {
  return renderHook(() => useAppStore(), { wrapper: createWrapper() })
}

describe("appReducer", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("Student actions", () => {
    it("ADD_STUDENT adds new student", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        // Wait for hydration
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const students = result.current.state.persisted.students
      expect(students).toHaveLength(1)
      expect(students[0].name).toBe("John Doe")
      expect(students[0].status).toBe("active")
      expect(students[0].id).toBeDefined()
      expect(students[0].createdAt).toBeDefined()
    })

    it("ADD_STUDENT rejects duplicate names (case-insensitive)", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      act(() => {
        result.current.actions.addStudent("john doe")
      })

      expect(result.current.state.persisted.students).toHaveLength(1)
    })

    it("ADD_STUDENT rejects empty names", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("")
      })

      expect(result.current.state.persisted.students).toHaveLength(0)
    })

    it("ADD_STUDENT rejects whitespace-only names", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("   ")
      })

      expect(result.current.state.persisted.students).toHaveLength(0)
    })

    it("ADD_STUDENT normalizes student name", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("  John   Doe  ")
      })

      expect(result.current.state.persisted.students[0].name).toBe("John Doe")
    })

    it("UPDATE_STUDENT updates existing student", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.updateStudent(studentId, "Jane Doe")
      })

      expect(result.current.state.persisted.students[0].name).toBe("Jane Doe")
    })

    it("UPDATE_STUDENT rejects duplicate names", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.addStudent("Jane Smith")
      })

      const johnId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.updateStudent(johnId, "Jane Smith")
      })

      // Name should not have changed
      expect(result.current.state.persisted.students[0].name).toBe("John Doe")
    })

    it("DELETE_STUDENT removes student", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.deleteStudent(studentId)
      })

      expect(result.current.state.persisted.students).toHaveLength(0)
    })

    it("TOGGLE_STUDENT_EXCLUDED changes status", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id
      expect(result.current.state.persisted.students[0].status).toBe("active")

      act(() => {
        result.current.actions.toggleStudentExcluded(studentId)
      })

      expect(result.current.state.persisted.students[0].status).toBe("excluded")

      act(() => {
        result.current.actions.toggleStudentExcluded(studentId)
      })

      expect(result.current.state.persisted.students[0].status).toBe("active")
    })

    it("CLEAR_STUDENTS removes all students", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.addStudent("Jane Smith")
      })

      expect(result.current.state.persisted.students).toHaveLength(2)

      act(() => {
        result.current.actions.clearStudents()
      })

      expect(result.current.state.persisted.students).toHaveLength(0)
    })
  })

  describe("Quiz actions", () => {
    it("CREATE_QUIZ creates new quiz", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [
          { id: "q1", prompt: "2+2?", answer: "4" },
        ])
      })

      expect(result.current.state.persisted.quizIndex).toHaveLength(1)
      expect(result.current.state.persisted.quizIndex[0].title).toBe("Math Quiz")

      const quizId = result.current.state.persisted.quizIndex[0].id
      expect(result.current.state.persisted.quizzes[quizId]).toBeDefined()
      expect(result.current.state.persisted.quizzes[quizId].questions).toHaveLength(1)
    })

    it("CREATE_QUIZ rejects empty title", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("", [])
      })

      expect(result.current.state.persisted.quizIndex).toHaveLength(0)
    })

    it("CREATE_QUIZ sets activeQuizId", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id
      expect(result.current.state.ui.quizEditor.activeQuizId).toBe(quizId)
    })

    it("UPDATE_QUIZ updates existing quiz", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.updateQuiz(quizId, "Updated Quiz", [
          { id: "q1", prompt: "3+3?", answer: "6" },
        ])
      })

      expect(result.current.state.persisted.quizzes[quizId].title).toBe("Updated Quiz")
      expect(result.current.state.persisted.quizzes[quizId].questions).toHaveLength(1)
    })

    it("UPDATE_QUIZ does nothing for non-existent quiz", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      const initialQuizzes = { ...result.current.state.persisted.quizzes }

      act(() => {
        result.current.actions.updateQuiz("non-existent", "Test", [])
      })

      expect(result.current.state.persisted.quizzes).toEqual(initialQuizzes)
    })

    it("DELETE_QUIZ removes quiz", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.deleteQuiz(quizId)
      })

      expect(result.current.state.persisted.quizIndex).toHaveLength(0)
      expect(result.current.state.persisted.quizzes[quizId]).toBeUndefined()
    })

    it("DELETE_QUIZ clears activeQuizId if deleted", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id
      expect(result.current.state.ui.quizEditor.activeQuizId).toBe(quizId)

      act(() => {
        result.current.actions.deleteQuiz(quizId)
      })

      expect(result.current.state.ui.quizEditor.activeQuizId).toBeNull()
    })

    it("SELECT_QUIZ_FOR_EDITOR sets activeQuizId", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Quiz 1", [])
        result.current.actions.createQuiz("Quiz 2", [])
      })

      const quiz1Id = result.current.state.persisted.quizIndex[1].id // older one

      act(() => {
        result.current.actions.selectQuizForEditor(quiz1Id)
      })

      expect(result.current.state.ui.quizEditor.activeQuizId).toBe(quiz1Id)
    })

    it("SELECT_QUIZ_FOR_EDITOR with null clears selection", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [])
      })

      act(() => {
        result.current.actions.selectQuizForEditor(null)
      })

      expect(result.current.state.ui.quizEditor.activeQuizId).toBeNull()
    })

    it("SET_EDITING_QUESTION sets editingQuestionId", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.setEditingQuestion("q1")
      })

      expect(result.current.state.ui.quizEditor.editingQuestionId).toBe("q1")
    })
  })

  describe("Quiz Play actions", () => {
    it("SELECT_QUIZ_FOR_PLAY resets play state", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [
          { id: "q1", prompt: "2+2?", answer: "4" },
        ])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.selectQuizForPlay(quizId)
      })

      expect(result.current.state.domain.quizPlay.selectedQuizId).toBe(quizId)
      expect(result.current.state.domain.quizPlay.usedQuestionIds).toEqual([])
      expect(result.current.state.domain.quizPlay.usedStudentIds).toEqual([])
      expect(result.current.state.domain.quizPlay.currentQuestionId).toBeNull()
      expect(result.current.state.domain.quizPlay.currentStudentId).toBeNull()
      expect(result.current.state.domain.quizPlay.answerRevealed).toBe(false)
    })

    it("SELECT_QUIZ_FOR_PLAY with null clears selection", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createQuiz("Math Quiz", [])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.selectQuizForPlay(quizId)
      })

      act(() => {
        result.current.actions.selectQuizForPlay(null)
      })

      expect(result.current.state.domain.quizPlay.selectedQuizId).toBeNull()
    })

    it("DRAW_QUIZ_PAIR selects random question and student", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.createQuiz("Math Quiz", [
          { id: "q1", prompt: "2+2?", answer: "4" },
        ])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.selectQuizForPlay(quizId)
      })

      act(() => {
        result.current.actions.drawQuizPair()
      })

      expect(result.current.state.domain.quizPlay.currentQuestionId).toBe("q1")
      expect(result.current.state.domain.quizPlay.currentStudentId).toBeDefined()
      expect(result.current.state.domain.quizPlay.usedQuestionIds).toContain("q1")
      expect(result.current.state.domain.quizPlay.answerRevealed).toBe(false)
    })

    it("DRAW_QUIZ_PAIR does nothing when no quiz selected", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.drawQuizPair()
      })

      expect(result.current.state.domain.quizPlay.currentQuestionId).toBeNull()
    })

    it("REVEAL_ANSWER sets answerRevealed to true", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.createQuiz("Math Quiz", [
          { id: "q1", prompt: "2+2?", answer: "4" },
        ])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.selectQuizForPlay(quizId)
        result.current.actions.drawQuizPair()
      })

      act(() => {
        result.current.actions.revealAnswer()
      })

      expect(result.current.state.domain.quizPlay.answerRevealed).toBe(true)
    })

    it("REVEAL_ANSWER does nothing when no current question", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.revealAnswer()
      })

      expect(result.current.state.domain.quizPlay.answerRevealed).toBe(false)
    })

    it("RESET_QUIZ_PLAY clears play state but keeps quiz selected", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.createQuiz("Math Quiz", [
          { id: "q1", prompt: "2+2?", answer: "4" },
        ])
      })

      const quizId = result.current.state.persisted.quizIndex[0].id

      act(() => {
        result.current.actions.selectQuizForPlay(quizId)
        result.current.actions.drawQuizPair()
        result.current.actions.revealAnswer()
      })

      act(() => {
        result.current.actions.resetQuizPlay()
      })

      expect(result.current.state.domain.quizPlay.selectedQuizId).toBe(quizId)
      expect(result.current.state.domain.quizPlay.usedQuestionIds).toEqual([])
      expect(result.current.state.domain.quizPlay.currentQuestionId).toBeNull()
      expect(result.current.state.domain.quizPlay.answerRevealed).toBe(false)
    })
  })

  describe("Generator actions", () => {
    it("DRAW_STUDENT selects random active student", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.addStudent("Jane Smith")
      })

      act(() => {
        result.current.actions.drawStudent()
      })

      expect(result.current.state.domain.generator.currentStudentId).toBeDefined()
      expect(result.current.state.domain.generator.usedStudentIds).toHaveLength(1)
    })

    it("DRAW_STUDENT does not select excluded students", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.toggleStudentExcluded(studentId)
      })

      act(() => {
        result.current.actions.drawStudent()
      })

      // Should not draw any student since all are excluded
      expect(result.current.state.domain.generator.currentStudentId).toBeNull()
    })

    it("DRAW_STUDENT does not repeat students until reset", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
        result.current.actions.addStudent("Jane Smith")
      })

      act(() => {
        result.current.actions.drawStudent()
      })

      const firstStudentId = result.current.state.domain.generator.currentStudentId

      act(() => {
        result.current.actions.drawStudent()
      })

      const secondStudentId = result.current.state.domain.generator.currentStudentId

      expect(secondStudentId).not.toBe(firstStudentId)
    })

    it("RESET_GENERATOR clears state", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      act(() => {
        result.current.actions.drawStudent()
      })

      expect(result.current.state.domain.generator.usedStudentIds).toHaveLength(1)

      act(() => {
        result.current.actions.resetGenerator()
      })

      expect(result.current.state.domain.generator.usedStudentIds).toEqual([])
      expect(result.current.state.domain.generator.currentStudentId).toBeNull()
    })
  })

  describe("Breakout/Project actions", () => {
    it("SET_BREAKOUT_GROUPS saves groups", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      const groups = {
        groupSize: 3,
        groupIds: [["id1", "id2", "id3"]],
        createdAt: Date.now(),
      }

      act(() => {
        result.current.actions.setBreakoutGroups(groups)
      })

      expect(result.current.state.persisted.breakoutGroups).toEqual(groups)
    })

    it("CLEAR_BREAKOUT_GROUPS removes groups", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.setBreakoutGroups({
          groupSize: 2,
          groupIds: [["id1"]],
          createdAt: Date.now(),
        })
      })

      act(() => {
        result.current.actions.clearBreakoutGroups()
      })

      expect(result.current.state.persisted.breakoutGroups).toBeNull()
    })

    it("CREATE_PROJECT_LIST creates list", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.createProjectList(
          "Project Alpha",
          "group",
          "A test project",
          [studentId],
          [[studentId]]
        )
      })

      expect(result.current.state.persisted.projectLists).toHaveLength(1)
      expect(result.current.state.persisted.projectLists[0].name).toBe("Project Alpha")
      expect(result.current.state.persisted.projectLists[0].projectType).toBe("group")
    })

    it("CREATE_PROJECT_LIST rejects empty name", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createProjectList("", "group", "", ["id1"], [])
      })

      expect(result.current.state.persisted.projectLists).toHaveLength(0)
    })

    it("CREATE_PROJECT_LIST rejects empty studentIds", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.createProjectList("Project", "group", "", [], [])
      })

      expect(result.current.state.persisted.projectLists).toHaveLength(0)
    })

    it("UPDATE_PROJECT_LIST updates list", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.createProjectList(
          "Project Alpha",
          "group",
          "",
          [studentId],
          []
        )
      })

      const projectId = result.current.state.persisted.projectLists[0].id

      act(() => {
        result.current.actions.updateProjectList(
          projectId,
          "Project Beta",
          "individual",
          "Updated description",
          [studentId],
          [[studentId]]
        )
      })

      expect(result.current.state.persisted.projectLists[0].name).toBe("Project Beta")
      expect(result.current.state.persisted.projectLists[0].projectType).toBe("individual")
      expect(result.current.state.persisted.projectLists[0].description).toBe("Updated description")
    })

    it("DELETE_PROJECT_LIST removes list", async () => {
      const { result } = renderAppStore()

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      act(() => {
        result.current.actions.addStudent("John Doe")
      })

      const studentId = result.current.state.persisted.students[0].id

      act(() => {
        result.current.actions.createProjectList(
          "Project Alpha",
          "group",
          "",
          [studentId],
          []
        )
      })

      const projectId = result.current.state.persisted.projectLists[0].id

      act(() => {
        result.current.actions.deleteProjectList(projectId)
      })

      expect(result.current.state.persisted.projectLists).toHaveLength(0)
    })
  })

  describe("UI actions", () => {
    it("HYDRATE_PERSISTED sets hydration flag to true after hydration", async () => {
      const { result } = renderAppStore()

      // Wait for hydration effect to run
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
      })

      // After hydration effect runs
      expect(result.current.state.ui.isHydrated).toBe(true)
    })
  })
})
