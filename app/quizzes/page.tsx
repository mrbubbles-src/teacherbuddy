import { Metadata } from 'next';

import QuizEditorSkeleton from '@/components/loading/quiz-editor-skeleton';
import QuizEditor from '@/components/quizzes/quiz-editor';

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description:
    'Create custom quizzes with your own questions and answers. Build assessments for any subject in minutes.',
};
/**
 * Renders the quiz authoring route.
 * Provides the editor workflow with a skeleton shown before hydration.
 */
export default function Page() {
  return <QuizEditor skeleton={<QuizEditorSkeleton />} />;
}
