const PRODUCTION_URL = 'https://teacherbuddy.mrbubbles-src.dev';

/**
 * Resolves the canonical site URL from environment variables.
 * Checks `NEXT_PUBLIC_SITE_URL` first, then Vercel env vars, then falls back
 * to the production URL.
 */
export function resolveSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(explicit);
  }

  const vercel = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  )?.trim();
  if (vercel) {
    return new URL(`https://${vercel}`);
  }

  return new URL(PRODUCTION_URL);
}
