'use client';

import { useAppStore } from '@/context/app-store';
import QuizEditorForm from '@/components/quizzes/quiz-editor-form';
import QuizImportCard from '@/components/quizzes/quiz-import-card';

/**
 * Quiz editor wrapper: shows server-rendered skeleton until hydrated, then the editor.
 * Skeleton is passed from the page (RSC) so it runs as a server component.
 */
export default function QuizEditor({
  skeleton,
}: {
  skeleton: React.ReactNode;
}) {
  const { state } = useAppStore();
  const activeQuizId = state.ui.quizEditor.activeQuizId;
  const activeQuiz = activeQuizId ? state.persisted.quizzes[activeQuizId] : null;

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>;
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
