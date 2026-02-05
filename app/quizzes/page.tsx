import QuizEditorSkeleton from '@/components/loading/quiz-editor-skeleton';
import QuizEditor from '@/components/quizzes/quiz-editor';

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <QuizEditor skeleton={<QuizEditorSkeleton />} />
    </div>
  );
}
