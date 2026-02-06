import type { Metadata } from 'next';

import { ROUTE_PAGE_META_BY_PATH } from '@/lib/page-meta';

/**
 * Canonical product name used across metadata titles and social cards.
 */
export const SITE_NAME = 'TeacherBuddy';

/**
 * Fallback site description for routes without custom text.
 */
export const DEFAULT_SITE_DESCRIPTION =
  'Manage students, build quizzes, and draw random pairs without repeats.';

const PRODUCTION_SITE_URL = 'https://teacherbuddy.mrbubbles-src.dev';
const DEFAULT_SITE_URL = PRODUCTION_SITE_URL;
const DEFAULT_OG_IMAGE_PATH = '/api/og';
const URL_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

/**
 * Shared Open Graph fields reused in layout and page metadata.
 */
export const SHARED_OPEN_GRAPH: NonNullable<Metadata['openGraph']> = {
  siteName: SITE_NAME,
  type: 'website',
  locale: 'en_US',
  images: [
    {
      url: buildAbsoluteMetadataUrl(DEFAULT_OG_IMAGE_PATH),
      width: 1200,
      height: 630,
      alt: 'TeacherBuddy Logo',
    },
  ],
};

/**
 * Shared Twitter card fields reused in layout and page metadata.
 */
export const SHARED_TWITTER: NonNullable<Metadata['twitter']> = {
  card: 'summary_large_image',
  images: [buildAbsoluteMetadataUrl(DEFAULT_OG_IMAGE_PATH)],
};

/**
 * Resolves a stable metadata base URL from runtime environment variables.
 */
export function resolveMetadataBase(): URL {
  const explicitSiteUrl = normalizeEnvUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicitSiteUrl) {
    return new URL(explicitSiteUrl);
  }

  const vercelSiteUrl = normalizeEnvUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
    { forceHttps: true },
  );
  if (vercelSiteUrl) {
    return new URL(vercelSiteUrl);
  }

  return new URL(DEFAULT_SITE_URL);
}

/**
 * Builds full metadata for a route, including canonical, Open Graph, and Twitter fields.
 */
export function buildPageMetadata(path: string): Metadata {
  const routeMeta =
    ROUTE_PAGE_META_BY_PATH[path as keyof typeof ROUTE_PAGE_META_BY_PATH];
  const title = routeMeta?.title ?? SITE_NAME;
  const description = routeMeta?.description ?? DEFAULT_SITE_DESCRIPTION;
  const canonicalPath = resolveCanonicalPath(path);
  const absoluteCanonicalUrl = buildAbsoluteMetadataUrl(canonicalPath);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title,
      description,
      url: absoluteCanonicalUrl,
    },
    twitter: {
      ...SHARED_TWITTER,
      title,
      description,
      creator: '@_MstrBubbles',
    },
  };
}

function resolveCanonicalPath(path: string): string {
  if (path.startsWith('/')) {
    return path;
  }

  return '/';
}

function normalizeEnvUrl(
  value: string | undefined,
  options?: { forceHttps?: boolean },
): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const hasProtocol = URL_PROTOCOL_PATTERN.test(trimmedValue);
  const isLocalHostValue =
    trimmedValue.startsWith('localhost') ||
    trimmedValue.startsWith('127.0.0.1');
  const inferredProtocol = isLocalHostValue ? 'http://' : 'https://';
  const normalizedInput = hasProtocol
    ? trimmedValue
    : `${inferredProtocol}${trimmedValue}`;

  try {
    const normalizedUrl = new URL(normalizedInput);
    if (options?.forceHttps) {
      normalizedUrl.protocol = 'https:';
    }

    return normalizedUrl.toString();
  } catch {
    return null;
  }
}

/**
 * Resolves an absolute metadata URL from a path using the active site base.
 */
function buildAbsoluteMetadataUrl(path: string): string {
  return new URL(path, resolveMetadataBase()).toString();
}
