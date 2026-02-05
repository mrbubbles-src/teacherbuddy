import { buildPageMetadata } from '@/lib/metadata';

import GeneratorCard from '@/components/generator/generator-card';
import GeneratorCardSkeleton from '@/components/loading/generator-card-skeleton';

/**
 * Builds SEO metadata for the random generator route.
 */
export function generateMetadata() {
  return buildPageMetadata('/generator');
}

/**
 * Renders the random student generator workflow.
 * Displays the generator card with a server-rendered loading fallback.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <GeneratorCard skeleton={<GeneratorCardSkeleton />} />
    </div>
  );
}
