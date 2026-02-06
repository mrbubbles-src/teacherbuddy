import { Metadata } from 'next';

import BreakoutGroupsCard from '@/components/breakout/breakout-groups-card';

/**
 * Builds SEO metadata for the breakout room generator route.
 */
export const metadata: Metadata = {
  title: 'Breakout Rooms | TeacherBuddy',
  description: 'Create randomized student groups for breakout sessions.',
  openGraph: {
    title: 'Breakout Rooms | TeacherBuddy',
    description: 'Create randomized student groups for breakout sessions.',
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
    title: 'Breakout Rooms | TeacherBuddy',
    description: 'Create randomized student groups for breakout sessions.',
    images: ['https://teacherbuddy.mrbubbles-src.dev/api/og'],
    creator: '@_MstrBubbles',
  },
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
