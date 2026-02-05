"use client"

import { useMemo, useState } from "react"
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react"

import type { Question, Quiz } from "@/lib/models"
import { useAppStore } from "@/context/app-store"
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

type QuizEditorFormProps = {
  quiz: Quiz | null
  quizId: string | null
  importCard: React.ReactNode
}

export default function QuizEditorForm({ quiz, quizId, importCard }: QuizEditorFormProps) {
  const { state, actions } = useAppStore()

  // Form state - initialized from props, reset via key pattern in parent
  const [title, setTitle] = useState(quiz?.title ?? "")
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions ?? [])
  const [prompt, setPrompt] = useState("")
  const [answer, setAnswer] = useState("")
  const [quizError, setQuizError] = useState<string | null>(null)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

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

    if (quizId) {
      actions.updateQuiz(quizId, trimmed, questions)
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
    setEditingQuestionId(null)
    setQuestionError(null)
  }

  const handleEditQuestion = (questionId: string) => {
    const question = questions.find((item) => item.id === questionId)
    if (!question) return
    setPrompt(question.prompt)
    setAnswer(question.answer)
    setEditingQuestionId(questionId)
    setQuestionError(null)
  }

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== questionId))
    if (editingQuestionId === questionId) {
      setEditingQuestionId(null)
      setPrompt("")
      setAnswer("")
    }
  }

  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    setPrompt("")
    setAnswer("")
    setQuestionError(null)
  }

  const handleNewQuiz = () => {
    actions.selectQuizForEditor(null)
  }

  const handleDeleteQuiz = () => {
    if (!quizId) return
    actions.deleteQuiz(quizId)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
          <CardHeader className="px-6 xl:px-8">
            <CardTitle className="text-xl">Quiz Details</CardTitle>
            <CardDescription className="text-base/relaxed">
              Select an existing quiz or start a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
            <QuizSelector
              label="Saved quizzes"
              value={quizId}
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
              <Button
                onClick={handleSaveQuiz}
                className="h-9 font-semibold text-base sm:min-w-32">
                Save Quiz
              </Button>
              <Button
                variant="secondary"
                onClick={handleNewQuiz}
                className="h-9 font-semibold text-base sm:min-w-32">
                New Quiz
              </Button>
            </div>
            {quizId ? (
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

        <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
          <CardHeader className="px-6 xl:px-8">
            <CardTitle className="text-xl">{editingQuestion ? "Edit Question" : "Add Question"}</CardTitle>
            <CardDescription className="text-base/relaxed">
              Add prompts and answers before saving the quiz.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
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
              <Button
                onClick={handleAddOrUpdateQuestion}
                className="h-9 font-semibold text-base sm:min-w-32">
                <PlusIcon className="size-3.5" />
                {editingQuestion ? "Update Question" : "Add Question"}
              </Button>
              {editingQuestion ? (
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="h-9 font-semibold text-base sm:min-w-32">
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {importCard}
      </div>

      <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
        <CardHeader className="px-6 xl:px-8">
          <CardTitle className="text-xl">Questions</CardTitle>
          <CardDescription className="text-base/relaxed">
            {questions.length
              ? `${questions.length} question${questions.length === 1 ? "" : "s"}`
              : "Add questions to build your quiz."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 xl:px-8 text-base/relaxed text-muted-foreground">
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
    </>
  )
}
