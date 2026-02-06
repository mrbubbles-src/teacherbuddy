import { Metadata } from 'next';

import QuizEditorSkeleton from '@/components/loading/quiz-editor-skeleton';
import QuizEditor from '@/components/quizzes/quiz-editor';

export const metadata: Metadata = {
  title: 'Quiz Builder | TeacherBuddy',
  description: 'Create and update quizzes with custom questions.',
  openGraph: {
    title: 'Quiz Builder | TeacherBuddy',
    description: 'Create and update quizzes with custom questions.',
    siteName: 'TeacherBuddy',
    images: [
      {
        url: 'https://teacherbuddy.mrbubbles-src.dev/api/og',
        width: 1200,
        height: 630,
        alt: 'TeacherBuddy Logo',
      },
    ],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz Builder | TeacherBuddy',
    description: 'Create and update quizzes with custom questions.',
    images: ['https://teacherbuddy.mrbubbles-src.dev/api/og'],
    creator: '@_MstrBubbles',
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
