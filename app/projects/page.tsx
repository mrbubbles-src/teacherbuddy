import { Metadata } from 'next';

import ProjectListBuilder from '@/components/projects/project-list-builder';
import ProjectListView from '@/components/projects/project-list-view';

export const metadata: Metadata = {
  title: 'Project Lists',
  description:
    'Build project lists, assign students to teams, and organise group work from your class roster.',
};
/**
 * Renders the project list management route.
 * Includes both list creation and saved list management sections.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ProjectListView />
      <ProjectListBuilder />
    </div>
  );
}
