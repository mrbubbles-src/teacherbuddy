# Routes

## App Layout

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with fonts, providers, and `AppShell` wrapper |
| `app/loading.tsx` | Global loading state for route transitions |
| `app/error.tsx` | Global error boundary with retry action |

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Dashboard with feature cards (server-rendered) |
| `/students` | `app/students/page.tsx` | Student management: add, import, edit, exclude |
| `/generator` | `app/generator/page.tsx` | Random student generator with no-repeat logic |
| `/quizzes` | `app/quizzes/page.tsx` | Quiz builder: create, edit, import questions |
| `/play` | `app/play/page.tsx` | Quiz play mode with question/student pairing |
| `/breakout-rooms` | `app/breakout-rooms/page.tsx` | Random group generator |
| `/projects` | `app/projects/page.tsx` | Project lists management |

## Navigation

The sidebar (`components/navigation/sidebar-nav.tsx`) displays links to all feature routes. The current route is highlighted based on pathname matching.

## Route Components

Each route page typically renders:
1. A main feature card component
2. Optional secondary components (tables, lists)
3. Hydration skeletons until `state.ui.isHydrated` is true

## Static Generation

All routes are statically generated at build time. Client-side state hydration happens on mount via the `AppStoreProvider`.
