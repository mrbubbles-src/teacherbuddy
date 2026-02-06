import { Metadata } from 'next';

import QuizEditorSkeleton from '@/components/loading/quiz-editor-skeleton';
import QuizEditor from '@/components/quizzes/quiz-editor';

export const metadata: Metadata = {
  title: 'Quiz Builder | TeacherBuddy',
  description: 'Create and update quizzes with custom questions.',
  openGraph: {
    title: 'Quiz Builder | TeacherBuddy',
    description: 'Create and update quizzes with custom questions.',
  },
  twitter: {
    title: 'Quiz Builder | TeacherBuddy',
    description: 'Create and update quizzes with custom questions.',
  },
};
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
