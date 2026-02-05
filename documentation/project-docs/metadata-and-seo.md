# Metadata and SEO

How TeacherBuddy configures route metadata, Open Graph, and Twitter cards in the Next.js App Router.

## Overview

TeacherBuddy defines metadata in two places:

1. `app/layout.tsx` for app-wide defaults (`metadataBase`, title template, shared social defaults).
2. Route `generateMetadata()` exports for page-specific title, description, canonical URL, and social tags.

This split follows Next.js metadata merge behavior: nested fields like `openGraph` are shallow-merged and replaced at the page level, so each page returns a complete `openGraph` object.

## Source of Truth

| File                  | Purpose                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `lib/page-meta.ts`    | Route title/description source of truth for top-level routes                              |
| `lib/page-info.tsx`   | In-app help content and header metadata (built from route meta + help content)            |
| `lib/metadata.ts`     | Metadata utilities (`resolveMetadataBase`, `buildPageMetadata`, shared OG/Twitter fields) |
| `lib/og-image.tsx`    | Shared `next/og` image renderer used by OG routes                                         |
| `app/layout.tsx`      | Global metadata defaults                                                                  |
| `app/**/page.tsx`     | Route-level `generateMetadata()` exports                                                  |
| `app/api/og/route.ts` | API-style Open Graph endpoint (`next/og`)                                                 |

## Open Graph Image

TeacherBuddy uses a generated OG image route:

- Path: `/api/og`
- API route file: `app/api/og/route.ts`
- Rendered dimensions: `1200x630`

The shared OG and Twitter image path is defined once in `lib/metadata.ts`.

## Environment Variables

`resolveMetadataBase()` uses this fallback order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `VERCEL_URL`
4. `http://localhost:3000` (default fallback)

Use `NEXT_PUBLIC_SITE_URL` in production for stable canonical and social URLs.

## Adding Metadata for a New Route

1. Add the route text entry in `lib/page-meta.ts`.
2. Add the corresponding page help entry in `lib/page-info.tsx`.
3. Export `generateMetadata()` in the new route page file:

```ts
import { buildPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return buildPageMetadata('/your-route');
}
```

4. Confirm `bun run typecheck`, `bun run lint`, `bun run test:run`, and `bun run build` pass.
