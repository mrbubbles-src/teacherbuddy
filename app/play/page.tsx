import { Metadata } from 'next';

import QuizPlayCardSkeleton from '@/components/loading/quiz-play-card-skeleton';
import QuizPlayCard from '@/components/play/quiz-play-card';

export const metadata: Metadata = {
  title: 'Quiz Play',
  description:
    'Run live quizzes in class — randomly draw a student and question, then reveal the answer together.',
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
