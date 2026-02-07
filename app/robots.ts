import type { MetadataRoute } from 'next';

import { resolveSiteUrl } from '@/lib/site-url';

/**
 * Generates robots directives for crawlable public routes.
 * Next.js serves this metadata route automatically at `/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  const base = resolveSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', base).toString(),
    host: base.origin,
  };
}
