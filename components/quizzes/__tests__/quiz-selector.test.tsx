import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { QuizIndexEntry } from "@/lib/models"
import QuizSelector from "@/components/quizzes/quiz-selector"

describe("QuizSelector", () => {
  const mockQuizzes: QuizIndexEntry[] = [
    { id: "quiz1", title: "Math Quiz", createdAt: 1000 },
    { id: "quiz2", title: "Science Quiz", createdAt: 2000 },
    { id: "quiz3", title: "History Quiz", createdAt: 3000 },
  ]

  it("renders label", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={mockQuizzes}
      />
    )

    expect(screen.getByText("Select Quiz")).toBeInTheDocument()
  })

  it("renders placeholder when no selection", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={mockQuizzes}
        placeholder="Choose a quiz"
      />
    )

    expect(screen.getByText("Choose a quiz")).toBeInTheDocument()
  })

  it("renders default placeholder when not provided", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={mockQuizzes}
      />
    )

    expect(screen.getByText("Select a quiz")).toBeInTheDocument()
  })

  it("shows combobox with selected value", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value="quiz1"
        onChange={() => {}}
        quizzes={mockQuizzes}
      />
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger).toBeInTheDocument()
    // The hidden input stores the selected value
    const hiddenInput = document.querySelector('input[value="quiz1"]')
    expect(hiddenInput).toBeInTheDocument()
  })

  it("shows message when no quizzes available", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={[]}
      />
    )

    expect(screen.getByText(/save a quiz to make it available/i)).toBeInTheDocument()
  })

  it("is disabled when no quizzes available", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={[]}
      />
    )

    // The trigger button should be disabled
    const trigger = screen.getByRole("combobox")
    expect(trigger).toBeDisabled()
  })

  it("is enabled when quizzes available", () => {
    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={mockQuizzes}
      />
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger).not.toBeDisabled()
  })

  it("calls onChange when quiz selected", async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={mockOnChange}
        quizzes={mockQuizzes}
      />
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    // Find and click the option
    const option = await screen.findByRole("option", { name: "Science Quiz" })
    await user.click(option)

    expect(mockOnChange).toHaveBeenCalledWith("quiz2")
  })

  it("shows quiz titles in dropdown options", async () => {
    const user = userEvent.setup()

    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={mockQuizzes}
      />
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    // All quiz titles should appear as options
    expect(await screen.findByRole("option", { name: "Math Quiz" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Science Quiz" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "History Quiz" })).toBeInTheDocument()
  })

  it("handles quiz with empty title in dropdown", async () => {
    const user = userEvent.setup()
    const quizzesWithEmpty: QuizIndexEntry[] = [
      { id: "quiz1", title: "", createdAt: 1000 },
    ]

    render(
      <QuizSelector
        label="Select Quiz"
        value={null}
        onChange={() => {}}
        quizzes={quizzesWithEmpty}
      />
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    // Should show "Untitled quiz" in dropdown options
    expect(await screen.findByRole("option", { name: "Untitled quiz" })).toBeInTheDocument()
  })
})
