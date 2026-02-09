# Routes

## App Layout

| File              | Purpose                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`  | Root layout: metadata (title template `%s | TeacherBuddy`, OG, Twitter), ld+json WebApplication schema, fonts (Geist), ThemeProvider, AppStoreProvider, AppShell, Footer, **PrivacyNotice**, **Toaster** (sonner, bottom-center). |
| `app/loading.tsx` | Global loading state for route transitions                                                                                             |
| `app/error.tsx`   | Global error boundary with retry action                                                                                                |

## Pages

| Route             | File                          | Description                                    |
| ----------------- | ----------------------------- | ---------------------------------------------- |
| `/`               | `app/page.tsx`                | Dashboard with feature cards (server-rendered) |
| `/students`       | `app/students/page.tsx`       | Student management: add, import, edit, exclude |
| `/generator`      | `app/generator/page.tsx`      | Random student generator with no-repeat logic  |
| `/quizzes`        | `app/quizzes/page.tsx`        | Quiz builder: create/edit quizzes, manage question cards, import one or many quizzes from JSON |
| `/play`           | `app/play/page.tsx`           | Quiz play mode with question/student pairing   |
| `/breakout-rooms` | `app/breakout-rooms/page.tsx` | Random group generator                         |
| `/projects`       | `app/projects/page.tsx`       | Project lists management                       |

## Route Metadata

- Root layout sets app-wide defaults in `app/layout.tsx`: `metadataBase`, title template `%s | TeacherBuddy`, Open Graph, Twitter, and inline ld+json WebApplication schema (name, description, category, offers).
- Each route page exports `metadata: Metadata` with `title` and `description` for SEO (e.g. `app/students/page.tsx`, `app/quizzes/page.tsx`).
- Route titles and descriptions align with in-app page info from `lib/page-info.tsx` / `lib/page-meta.ts`.
- Open Graph image is generated via `next/og` at `/api/og` (`app/api/og/route.tsx`). Optional: `app/robots.ts`, `app/sitemap.ts` for crawlers.

## Navigation

- **Sidebar**: `components/navigation/sidebar-nav.tsx` – links to all feature routes; current route highlighted by pathname. Sidebar is collapsible (icon-only mode) via `SidebarProvider` in `AppShell`.
- **Header**: Every page shows a header with title, description, **PageInfoDialog** (help button next to title), sidebar trigger, theme toggle, and **QuizTimerCard**. Page title and description come from `lib/page-info.tsx` via `getPageInfoByPath(pathname)`. See `components/header.tsx`.

## Route Components

Each route page typically:

1. Exports `metadata` with `title` and `description` for SEO
2. Renders a main feature component, passing a `skeleton` prop where applicable (e.g. `StudentForm skeleton={<StudentFormSkeleton />}`, `QuizEditor skeleton={<QuizEditorSkeleton />}`)
3. Optionally renders secondary components (e.g. `StudentTable`, `ProjectListView`)
4. Feature components show the skeleton until `state.ui.isHydrated` is true

## Static Generation

All routes are statically generated at build time. Client-side state is hydrated on mount via `AppStoreProvider` and persisted to `localStorage` (see [state-and-storage.md](state-and-storage.md)).
