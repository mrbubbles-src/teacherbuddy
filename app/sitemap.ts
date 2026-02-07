import type { MetadataRoute } from 'next';

import { ROUTE_PATHS } from '@/lib/page-meta';
import { resolveSiteUrl } from '@/lib/site-url';

/**
 * Generates the XML sitemap entries for all top-level TeacherBuddy routes.
 * Next.js serves this metadata route automatically at `/sitemap.xml`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveSiteUrl();
  const lastModified = new Date();

  return ROUTE_PATHS.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
