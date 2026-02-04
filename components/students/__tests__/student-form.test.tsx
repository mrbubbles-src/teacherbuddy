import userEvent from "@testing-library/user-event"
import { screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import StudentForm from "@/components/students/student-form"
import { renderWithProvider } from "@/__tests__/test-utils"

describe("StudentForm", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  const setupUser = () => userEvent.setup()

  it("renders input and button", async () => {
    renderWithProvider(<StudentForm />)

    // Wait for hydration
    await waitFor(() => {
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: /add student/i })).toBeInTheDocument()
  })

  it("renders placeholder text", async () => {
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/alex johnson/i)).toBeInTheDocument()
    })
  })

  it("adds student on submit", async () => {
    const user = setupUser()
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/student name/i)
    const button = screen.getByRole("button", { name: /add student/i })

    await user.type(input, "John Doe")
    await user.click(button)

    // Input should be cleared after successful add
    expect(input).toHaveValue("")
  })

  it("shows error for empty name", async () => {
    const user = setupUser()
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: /add student/i })

    await user.click(button)

    expect(screen.getByText(/enter at least one new student name/i)).toBeInTheDocument()
  })

  it("clears input after successful add", async () => {
    const user = setupUser()
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/student name/i)
    const button = screen.getByRole("button", { name: /add student/i })

    await user.type(input, "John Doe")

    expect(input).toHaveValue("John Doe")

    await user.click(button)

    expect(input).toHaveValue("")
  })

  it("clears error when typing", async () => {
    const user = setupUser()
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/student name/i)
    const button = screen.getByRole("button", { name: /add student/i })

    // Trigger error first
    await user.click(button)

    expect(screen.getByText(/enter at least one new student name/i)).toBeInTheDocument()

    // Type to clear error
    await user.type(input, "J")

    expect(screen.queryByText(/enter at least one new student name/i)).not.toBeInTheDocument()
  })

  it("handles comma-separated names", async () => {
    const user = setupUser()
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/student name/i)
    const button = screen.getByRole("button", { name: /add student/i })

    await user.type(input, "John Doe, Jane Smith, Bob Wilson")
    await user.click(button)

    // Input should be cleared after successful add
    expect(input).toHaveValue("")
  })

  it("shows file import section", async () => {
    renderWithProvider(<StudentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/import from/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/upload a .txt file/i)).toBeInTheDocument()
  })
})
