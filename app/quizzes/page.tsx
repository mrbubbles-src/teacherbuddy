import { buildPageMetadata } from '@/lib/metadata';

import QuizEditorSkeleton from '@/components/loading/quiz-editor-skeleton';
import QuizEditor from '@/components/quizzes/quiz-editor';

/**
 * Builds SEO metadata for the quiz builder route.
 */
export function generateMetadata() {
  return buildPageMetadata('/quizzes');
}

/**
 * Renders the quiz authoring route.
 * Provides the editor workflow with a skeleton shown before hydration.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <QuizEditor skeleton={<QuizEditorSkeleton />} />
    </div>
  );
}
