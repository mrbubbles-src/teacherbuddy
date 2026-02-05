import { buildPageMetadata } from '@/lib/metadata';

import ProjectListBuilder from '@/components/projects/project-list-builder';
import ProjectListView from '@/components/projects/project-list-view';

/**
 * Builds SEO metadata for the project lists route.
 */
export function generateMetadata() {
  return buildPageMetadata('/projects');
}

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
