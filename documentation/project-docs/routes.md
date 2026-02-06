# Routes

## App Layout

| File              | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| `app/layout.tsx`  | Root layout with fonts, providers, and `AppShell` wrapper |
| `app/loading.tsx` | Global loading state for route transitions                |
| `app/error.tsx`   | Global error boundary with retry action                   |

## Pages

| Route             | File                          | Description                                    |
| ----------------- | ----------------------------- | ---------------------------------------------- |
| `/`               | `app/page.tsx`                | Dashboard with feature cards (server-rendered) |
| `/students`       | `app/students/page.tsx`       | Student management: add, import, edit, exclude |
| `/generator`      | `app/generator/page.tsx`      | Random student generator with no-repeat logic  |
| `/quizzes`        | `app/quizzes/page.tsx`        | Quiz builder: create, edit, import questions   |
| `/play`           | `app/play/page.tsx`           | Quiz play mode with question/student pairing   |
| `/breakout-rooms` | `app/breakout-rooms/page.tsx` | Random group generator                         |
| `/projects`       | `app/projects/page.tsx`       | Project lists management                       |

## Route Metadata

- Root defaults are set in `app/layout.tsx` (`metadataBase`, default Open Graph, default Twitter metadata).
- Each primary route exports `generateMetadata()` and calls `buildPageMetadata(path)` from `lib/metadata.ts`.
- Route title and description values come from `lib/page-meta.ts`, which is shared with in-app page info.
- Open Graph image is generated via `next/og` and served at `/api/og` (`app/api/og/route.ts`).

## Navigation

- **Sidebar**: `components/navigation/sidebar-nav.tsx` – links to all feature routes; current route highlighted by pathname. Sidebar is collapsible (icon-only mode) via `SidebarProvider` in `AppShell`.
- **Header**: Every page shows a header with title, description, **PageInfoDialog** (help button next to title), sidebar trigger, theme toggle, and **QuizTimerCard**. Page title and description come from `lib/page-info.tsx` via `getPageInfoByPath(pathname)`. See `components/header.tsx`.

## Route Components

Each route page typically:

1. Renders a main feature card component
2. Optionally renders secondary components (tables, lists)
3. Shows hydration skeletons until `state.ui.isHydrated` is true

## Static Generation

All routes are statically generated at build time. Client-side state is hydrated on mount via `AppStoreProvider` and persisted to `localStorage` (see [state-and-storage.md](state-and-storage.md)).
