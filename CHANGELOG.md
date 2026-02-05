# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Rethought Data Security

## [1.1.3] - 2026-02-05

### Added

- Route-aware SEO metadata utility in `lib/metadata.ts` with `resolveMetadataBase()` and `buildPageMetadata(path)`.
- Shared route metadata source in `lib/page-meta.ts` reused by both in-app page info and SEO metadata.
- Route-level `generateMetadata()` exports for `/`, `/students`, `/generator`, `/quizzes`, `/play`, `/breakout-rooms`, and `/projects`.
- Metadata tests in `lib/__tests__/metadata.test.ts` covering metadata base fallback and Open Graph/Twitter composition.
- New metadata documentation: `documentation/project-docs/metadata-and-seo.md`.
- Generated Open Graph image route with `next/og`: `app/api/og/route.ts` (`/api/og`).

### Changed

- Root layout metadata now defines app-wide `metadataBase`, Open Graph defaults, and Twitter defaults.
- Shared Open Graph/Twitter metadata now points to the generated `/api/og` endpoint.
- Root dashboard metadata title is explicitly `Dashboard | TeacherBuddy` for title consistency with other pages.
- `lib/page-info.tsx` now consumes shared route metadata from `lib/page-meta.ts`.
- Project docs and README now document metadata and Open Graph patterns, including `NEXT_PUBLIC_SITE_URL`.
- Logo to `/` page
- Logo to Footer
- Favicon switched to be aligned with the logo
- Switched Icon in Sidebar Header to be aligned with the logo

## [1.1.2] - 2026-02-05

### Added

- **In-app help**: PageInfoDialog — help button (?) next to the page title in the header opens a modal with a per-page tutorial (what the page does, what to do, what you get). Content is defined in `lib/page-info.tsx`.
- Page metadata and help content in `lib/page-info.tsx` (`PAGE_INFOS`, `PAGE_INFO_BY_PATH`); header title and description are now driven from this data.
- Dialog and Tabs UI components (`components/ui/dialog.tsx`, `components/ui/tabs.tsx`).
- Component tests for PageInfoDialog (`components/utility/__tests__/page-info-dialog.test.tsx`).

### Changed

- App shell and header now use page info for route metadata and pass an `info` prop to Header for PageInfoDialog.
- Project documentation: components (PageInfoDialog, Dialog, Tabs), structure (lib/page-info), routes, testing, getting-started (page-info step), hooks (useIsMobile), README (in-app help).

## [1.1.1] - 2026-02-05

### Fixed

- Design Fixes
  - Responsiveness of the app
  - Accessibility of the app

### Changed

- Performance Improvements

## [1.1.0] - 2026-02-04

### Added

- QuizTimerCard with audio feedback and volume control
- Quick timer display in sidebar on all pages
- Project lists page with builder, view, and persistence
- Comprehensive test suite using Vitest and React Testing Library
  - 247 tests across 8 test files
  - Unit tests for type guards (`lib/__tests__/type-guards.test.ts`)
  - Unit tests for student utilities (`lib/__tests__/students.test.ts`)
  - Unit tests for storage functions (`lib/__tests__/storage.test.ts`)
  - Hook tests for `useTimer` (`hooks/__tests__/use-timer.test.ts`)
  - Hook tests for `useCopyToClipboard` (`hooks/__tests__/use-copy-to-clipboard.test.ts`)
  - Integration tests for app reducer (`context/__tests__/app-reducer.test.ts`)
  - Component tests for `StudentForm` and `QuizSelector`
- Test configuration files (`vitest.config.ts`, `vitest.setup.ts`)
- Test utilities with AppStoreProvider wrapper (`__tests__/test-utils.tsx`)
- npm scripts: `test`, `test:ui`, `test:coverage`, `test:run`
- Testing documentation (`documentation/project-docs/testing.md`)

### Changed

- Refactored components for improved state management
- Updated `package.json` with testing dependencies and scripts

### Developer Experience

- Tests provide ~80% coverage on core business logic (lib/, context/)
- Mocked localStorage and crypto.randomUUID in test setup
- Component tests use custom render wrapper with providers

## [1.0.0] - 2026-02-03

### Added

- Server-safe style variants for buttons and badges
- Dashboard cards as server component
- Hydration skeletons for feature views
- Global `app/loading.tsx` and `app/error.tsx` boundaries
- Project documentation and expanded README
- MIT license

### Fixed

- Theme toggle hydration label mismatch
- Tightened student status typing
