import { buildPageMetadata } from '@/lib/metadata';

import QuizPlayCardSkeleton from '@/components/loading/quiz-play-card-skeleton';
import QuizPlayCard from '@/components/play/quiz-play-card';

/**
 * Builds SEO metadata for the live quiz play route.
 */
export function generateMetadata() {
  return buildPageMetadata('/play');
}

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
