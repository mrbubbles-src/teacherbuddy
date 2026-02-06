import { Metadata } from 'next';

import GeneratorCard from '@/components/generator/generator-card';
import GeneratorCardSkeleton from '@/components/loading/generator-card-skeleton';

/**
 * Builds SEO metadata for the random generator route.
 */
export const metadata: Metadata = {
  title: 'Student Generator | TeacherBuddy',
  description: 'Pick a random student without repeats.',
  openGraph: {
    title: 'Student Generator | TeacherBuddy',
    description: 'Pick a random student without repeats.',
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
    title: 'Student Generator | TeacherBuddy',
    description: 'Pick a random student without repeats.',
    images: ['https://teacherbuddy.mrbubbles-src.dev/api/og'],
    creator: '@_MstrBubbles',
  },
};

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
