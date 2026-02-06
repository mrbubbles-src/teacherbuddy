import { Metadata } from 'next';

import ProjectListBuilder from '@/components/projects/project-list-builder';
import ProjectListView from '@/components/projects/project-list-view';

export const metadata: Metadata = {
  title: 'Project Lists | TeacherBuddy',
  description: 'Build project lists and group students from your roster.',
  openGraph: {
    title: 'Project Lists | TeacherBuddy',
    description: 'Build project lists and group students from your roster.',
  },
  twitter: {
    title: 'Project Lists | TeacherBuddy',
    description: 'Build project lists and group students from your roster.',
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
