import { Metadata } from 'next';

import ProjectListBuilder from '@/components/projects/project-list-builder';
import ProjectListView from '@/components/projects/project-list-view';

export const metadata: Metadata = {
  title: 'Project Lists | TeacherBuddy',
  description: 'Build project lists and group students from your roster.',
  openGraph: {
    title: 'Project Lists | TeacherBuddy',
    description: 'Build project lists and group students from your roster.',
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
    title: 'Project Lists | TeacherBuddy',
    description: 'Build project lists and group students from your roster.',
    images: ['https://teacherbuddy.mrbubbles-src.dev/api/og'],
    creator: '@_MstrBubbles',
  },
};
/**
 * Renders the project list management route.
 * Includes both list creation and saved list management sections.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ProjectListBuilder />
      <ProjectListView />
    </div>
  );
}
