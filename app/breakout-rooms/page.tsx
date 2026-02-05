import { buildPageMetadata } from '@/lib/metadata';

import BreakoutGroupsCard from '@/components/breakout/breakout-groups-card';

/**
 * Builds SEO metadata for the breakout room generator route.
 */
export function generateMetadata() {
  return buildPageMetadata('/breakout-rooms');
}

/**
 * Renders the breakout room generator workflow.
 * Lets teachers generate and copy randomized student groups.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <BreakoutGroupsCard />
    </div>
  );
}
