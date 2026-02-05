import type { MetadataRoute } from 'next';

import { resolveMetadataBase } from '@/lib/metadata';

/**
 * Generates robots directives for crawlable public routes.
 * Next.js serves this metadata route automatically at `/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  const metadataBase = resolveMetadataBase();
  const host = metadataBase.origin;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', metadataBase).toString(),
    host,
  };
}
