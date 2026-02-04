"use client"

import { useMemo } from "react"

import { useAppStore } from "@/context/app-store"
import { formatStudentName } from "@/lib/students"
import QuizPlayCardSkeleton from "@/components/loading/quiz-play-card-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuizSelector from "@/components/quizzes/quiz-selector"

export default function QuizPlayCard() {
  const { state, actions } = useAppStore()

  const selectedQuizId = state.domain.quizPlay.selectedQuizId
  const quiz = selectedQuizId ? state.persisted.quizzes[selectedQuizId] : null

  const activeStudents = useMemo(
    () => state.persisted.students.filter((student) => student.status === "active"),
    [state.persisted.students]
  )

  const availableQuestionIds = useMemo(() => {
    if (!quiz) return []
    return quiz.questions
      .filter((question) => !state.domain.quizPlay.usedQuestionIds.includes(question.id))
      .map((question) => question.id)
  }, [quiz, state.domain.quizPlay.usedQuestionIds])

  const availableStudentIds = useMemo(() => {
    return activeStudents
      .filter((student) => !state.domain.quizPlay.usedStudentIds.includes(student.id))
      .map((student) => student.id)
  }, [activeStudents, state.domain.quizPlay.usedStudentIds])

  const currentQuestion = quiz?.questions.find(
    (question) => question.id === state.domain.quizPlay.currentQuestionId
  )
  const currentStudent = state.persisted.students.find(
    (student) => student.id === state.domain.quizPlay.currentStudentId
  )

  const canDraw =
    !!quiz && availableQuestionIds.length > 0 && availableStudentIds.length > 0

  if (!state.ui.isHydrated) {
    return <QuizPlayCardSkeleton />
  }

  return (
    <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="lg:text-lg">Quiz Play Mode</CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          Draw a random student and question. Reveal answers when ready.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 lg:px-6 xl:px-8 lg:gap-5 xl:gap-6 lg:text-base/relaxed">
        <QuizSelector
          label="Select quiz"
          value={selectedQuizId}
          onChange={actions.selectQuizForPlay}
          quizzes={state.persisted.quizIndex}
          placeholder="Choose a quiz to play"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 min-h-[140px] flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:text-base">
              Selected Student
            </p>
            <p className="mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl line-clamp-2">
              {currentStudent ? formatStudentName(currentStudent.name) : "—"}
            </p>
            <Badge variant="secondary" className="mt-2">
              {availableStudentIds.length} remaining
            </Badge>
          </div>
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 min-h-[140px] flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:text-base">
              Question
            </p>
            <p className="mt-3 text-base font-medium lg:text-lg line-clamp-3">
              {currentQuestion ? currentQuestion.prompt : "—"}
            </p>
            <Badge variant="secondary" className="mt-2">
              {availableQuestionIds.length} remaining
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/60 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Answer
          </p>
          <p className="mt-2 text-base">
            {state.domain.quizPlay.answerRevealed
              ? currentQuestion?.answer ?? "—"
              : "Click reveal to show the answer."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={actions.drawQuizPair} disabled={!canDraw} className="sm:min-w-32">
            Draw Student + Question
          </Button>
          <Button
            variant="secondary"
            onClick={actions.revealAnswer}
            disabled={!currentQuestion || state.domain.quizPlay.answerRevealed}
            className="sm:min-w-32"
          >
            Reveal Answer
          </Button>
          <Button
            variant="ghost"
            onClick={actions.resetQuizPlay}
            disabled={!selectedQuizId}
            className="sm:min-w-32"
          >
            Reset Round
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
