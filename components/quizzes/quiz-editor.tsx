"use client"

import { useEffect, useMemo, useState } from "react"
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react"

import type { Question } from "@/lib/models"
import { useAppStore } from "@/context/app-store"
import QuizEditorSkeleton from "@/components/loading/quiz-editor-skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import QuizSelector from "@/components/quizzes/quiz-selector"

export default function QuizEditor() {
  const { state, actions } = useAppStore()
  const activeQuizId = state.ui.quizEditor.activeQuizId
  const activeQuiz = activeQuizId ? state.persisted.quizzes[activeQuizId] : null
  const editingQuestionId = state.ui.quizEditor.editingQuestionId

  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [prompt, setPrompt] = useState("")
  const [answer, setAnswer] = useState("")
  const [quizError, setQuizError] = useState<string | null>(null)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [importPayload, setImportPayload] = useState("")
  const [importError, setImportError] = useState<string | null>(null)
  const [importNotice, setImportNotice] = useState<string | null>(null)

  useEffect(() => {
    queueMicrotask(() => {
      if (activeQuiz) {
        setTitle(activeQuiz.title)
        setQuestions(activeQuiz.questions)
      } else {
        setTitle("")
        setQuestions([])
      }
      setPrompt("")
      setAnswer("")
      actions.setEditingQuestion(null)
      setQuizError(null)
      setQuestionError(null)
      setImportError(null)
      setImportNotice(null)
    })
  }, [activeQuizId, activeQuiz, actions])
    if (activeQuiz) {
      setTitle(activeQuiz.title)
      setQuestions(activeQuiz.questions)
    } else {
      setTitle("")
      setQuestions([])
    }
    setPrompt("")
    setAnswer("")
    actions.setEditingQuestion(null)
    setQuizError(null)
    setQuestionError(null)
    setImportError(null)
    setImportNotice(null)
  }, [activeQuizId, actions])

  const editingQuestion = useMemo(
    () => questions.find((question) => question.id === editingQuestionId) ?? null,
    [questions, editingQuestionId]
  )

  const handleSaveQuiz = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      setQuizError("Quiz title is required.")
      return
    }
    if (!questions.length) {
      setQuizError("Add at least one question before saving.")
      return
    }

    if (activeQuizId) {
      actions.updateQuiz(activeQuizId, trimmed, questions)
    } else {
      actions.createQuiz(trimmed, questions)
    }
    setQuizError(null)
  }

  const handleAddOrUpdateQuestion = () => {
    const trimmedPrompt = prompt.trim()
    const trimmedAnswer = answer.trim()

    if (!trimmedPrompt || !trimmedAnswer) {
      setQuestionError("Both question and answer are required.")
      return
    }

    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === editingQuestionId
            ? { ...question, prompt: trimmedPrompt, answer: trimmedAnswer }
            : question
        )
      )
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          prompt: trimmedPrompt,
          answer: trimmedAnswer,
        },
      ])
    }

    setPrompt("")
    setAnswer("")
    actions.setEditingQuestion(null)
    setQuestionError(null)
  }

  const handleEditQuestion = (questionId: string) => {
    const question = questions.find((item) => item.id === questionId)
    if (!question) return
    setPrompt(question.prompt)
    setAnswer(question.answer)
    actions.setEditingQuestion(questionId)
    setQuestionError(null)
  }

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== questionId))
    if (editingQuestionId === questionId) {
      actions.setEditingQuestion(null)
      setPrompt("")
      setAnswer("")
    }
  }

  const handleCancelEdit = () => {
    actions.setEditingQuestion(null)
    setPrompt("")
    setAnswer("")
    setQuestionError(null)
  }

  const handleNewQuiz = () => {
    actions.selectQuizForEditor(null)
    setTitle("")
    setQuestions([])
    setPrompt("")
    setAnswer("")
    actions.setEditingQuestion(null)
    setQuizError(null)
    setQuestionError(null)
    setImportError(null)
    setImportNotice(null)
  }

  const handleDeleteQuiz = () => {
    if (!activeQuizId) return
    actions.deleteQuiz(activeQuizId)
    setTitle("")
    setQuestions([])
    setPrompt("")
    setAnswer("")
    setQuizError(null)
    setQuestionError(null)
    setImportError(null)
    setImportNotice(null)
  }

  const handleImportQuiz = () => {
    if (!importPayload.trim()) {
      setImportError("Paste a JSON quiz payload to import.")
      setImportNotice(null)
      return
    }

    try {
      const parsed = JSON.parse(importPayload)
      const inputs = Array.isArray(parsed) ? parsed : [parsed]
      const drafts = inputs
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null
          const titleValue = (entry as { title?: unknown }).title
          const title = typeof titleValue === "string" ? titleValue.trim() : ""
          const questionsValue = (entry as { questions?: unknown }).questions
          if (!title || !Array.isArray(questionsValue)) return null

          const questions = questionsValue
            .map((question) => {
              if (!question || typeof question !== "object") return null
              const promptValue = (question as { prompt?: unknown }).prompt
              const answerValue = (question as { answer?: unknown }).answer
              const promptText =
                typeof promptValue === "string" ? promptValue.trim() : ""
              const answerText =
                typeof answerValue === "string" ? answerValue.trim() : ""
              if (!promptText || !answerText) return null
              return {
                id: crypto.randomUUID(),
                prompt: promptText,
                answer: answerText,
              }
            })
            .filter(Boolean) as Question[]

          if (!questions.length) return null
          return {
            title,
            questions,
          }
        })
        .filter(Boolean) as Array<{ title: string; questions: Question[] }>

      if (!drafts.length) {
        setImportError("No valid quiz data found in that JSON.")
        setImportNotice(null)
        return
      }

      drafts.forEach((draft) => actions.createQuiz(draft.title, draft.questions))
      setImportNotice(
        `Imported ${drafts.length} quiz${drafts.length === 1 ? "" : "zes"}.`
      )
      setImportError(null)
      setImportPayload("")
    } catch (error) {
      console.error("Failed to import quiz JSON", error)
      setImportError("Invalid JSON. Please check the format and try again.")
      setImportNotice(null)
    }
  }

  if (!state.ui.isHydrated) {
    return <QuizEditorSkeleton />
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>
              Select an existing quiz or start a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <QuizSelector
              label="Saved quizzes"
              value={activeQuizId}
              onChange={actions.selectQuizForEditor}
              quizzes={state.persisted.quizIndex}
              placeholder="Select a quiz to edit"
            />
            <Field>
              <FieldLabel htmlFor="quiz-title">Quiz title</FieldLabel>
              <FieldContent>
                <Input
                  id="quiz-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Geography Review"
                />
                <FieldDescription>
                  Titles are display-only and can be edited later.
                </FieldDescription>
              </FieldContent>
            </Field>
            {quizError ? <FieldError>{quizError}</FieldError> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleSaveQuiz} className="sm:flex-1">
                Save Quiz
              </Button>
              <Button
                variant="secondary"
                onClick={handleNewQuiz}
                className="sm:flex-1"
              >
                New Quiz
              </Button>
            </div>
            {activeQuizId ? (
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive" />}>Delete Quiz</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this quiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the quiz and its questions from local storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteQuiz}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingQuestion ? "Edit Question" : "Add Question"}</CardTitle>
            <CardDescription>
              Add prompts and answers before saving the quiz.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="question-prompt">Question</FieldLabel>
              <FieldContent>
                <Input
                  id="question-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="What is the capital of France?"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="question-answer">Answer</FieldLabel>
              <FieldContent>
                <Textarea
                  id="question-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Paris"
                />
              </FieldContent>
            </Field>
            {questionError ? <FieldError>{questionError}</FieldError> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleAddOrUpdateQuestion} className="sm:flex-1">
                <PlusIcon className="size-3.5" />
                {editingQuestion ? "Update Question" : "Add Question"}
              </Button>
              {editingQuestion ? (
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="sm:flex-1"
                >
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Quiz JSON</CardTitle>
            <CardDescription>
              Paste a JSON object or array that matches the quiz format.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="quiz-import">Quiz JSON</FieldLabel>
              <FieldContent>
                <Textarea
                  id="quiz-import"
                  value={importPayload}
                  onChange={(event) => {
                    setImportPayload(event.target.value)
                    if (importError) setImportError(null)
                  }}
                  placeholder='{"title":"Algebra","questions":[{"prompt":"2+2?","answer":"4"}]}'
                />
                <FieldDescription>
                  Required fields: <code>title</code> and <code>questions</code>{" "}
                  with <code>prompt</code> and <code>answer</code>.
                </FieldDescription>
                {importError ? <FieldError>{importError}</FieldError> : null}
                {importNotice ? (
                  <p className="text-sm text-muted-foreground">{importNotice}</p>
                ) : null}
              </FieldContent>
            </Field>
            <Button onClick={handleImportQuiz}>Import Quiz</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            {questions.length
              ? `${questions.length} question${questions.length === 1 ? "" : "s"}`
              : "Add questions to build your quiz."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="whitespace-normal">
                      {question.prompt}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {question.answer}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEditQuestion(question.id)}
                        >
                          <PencilIcon className="size-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveQuestion(question.id)}
                        >
                          <Trash2Icon className="size-3.5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-base text-muted-foreground">
              No questions yet. Add your first question to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
