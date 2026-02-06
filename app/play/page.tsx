import { Metadata } from 'next';

import QuizPlayCardSkeleton from '@/components/loading/quiz-play-card-skeleton';
import QuizPlayCard from '@/components/play/quiz-play-card';

/**
 * Builds SEO metadata for the live quiz play route.
 */
export const metadata: Metadata = {
  title: 'Quiz Play | TeacherBuddy',
  description: 'Draw a student and a question, then reveal the answer.',
  openGraph: {
    title: 'Quiz Play | TeacherBuddy',
    description: 'Draw a student and a question, then reveal the answer.',
  },
  twitter: {
    title: 'Quiz Play | TeacherBuddy',
    description: 'Draw a student and a question, then reveal the answer.',
  },
};
/**
 * Renders the live quiz play route.
 * Shows the play card and fallback skeleton for pre-hydration rendering.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <QuizPlayCard skeleton={<QuizPlayCardSkeleton />} />
    </div>
  );
}
