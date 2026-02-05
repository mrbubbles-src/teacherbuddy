import type { MetadataRoute } from 'next';

import { resolveMetadataBase } from '@/lib/metadata';
import { ROUTE_PATHS } from '@/lib/page-meta';

const HOME_PATH = '/';

function createAbsoluteUrl(path: string): string {
  const base = resolveMetadataBase();
  const pathname = path === HOME_PATH ? '/' : path;
  return new URL(pathname, base).toString();
}

/**
 * Generates the XML sitemap entries for all top-level TeacherBuddy routes.
 * Next.js serves this metadata route automatically at `/sitemap.xml`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTE_PATHS.map((path) => ({
    url: createAbsoluteUrl(path),
    lastModified,
    changeFrequency: 'weekly',
    priority: path === HOME_PATH ? 1 : 0.8,
  }));
}
