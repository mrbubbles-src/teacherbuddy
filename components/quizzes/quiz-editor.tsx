"use client"

import { useAppStore } from "@/context/app-store"
import QuizEditorSkeleton from "@/components/loading/quiz-editor-skeleton"
import QuizEditorForm from "@/components/quizzes/quiz-editor-form"
import QuizImportCard from "@/components/quizzes/quiz-import-card"

export default function QuizEditor() {
  const { state } = useAppStore()
  const activeQuizId = state.ui.quizEditor.activeQuizId
  const activeQuiz = activeQuizId ? state.persisted.quizzes[activeQuizId] : null

  if (!state.ui.isHydrated) {
    return <QuizEditorSkeleton />
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      {/* Key pattern: reset all form state when quiz changes */}
      <QuizEditorForm
        key={activeQuizId ?? "new"}
        quiz={activeQuiz}
        quizId={activeQuizId}
        importCard={<QuizImportCard />}
      />
    </div>
  )
}
