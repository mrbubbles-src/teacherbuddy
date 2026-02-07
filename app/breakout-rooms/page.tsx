import { Metadata } from 'next';

import BreakoutGroupsCard from '@/components/breakout/breakout-groups-card';

export const metadata: Metadata = {
  title: 'Breakout Rooms',
  description:
    'Instantly create randomised student groups for breakout sessions, discussions, or team activities.',
};

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
