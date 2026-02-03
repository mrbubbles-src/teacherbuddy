# Structure

## Overview

TeacherBuddy is a Next.js App Router application. The layout renders a client-driven `AppShell` that provides navigation, header metadata, and global theming. Feature routes use local state stored in `localStorage` and hydrated on the client.

## Data Flow

- On mount, `context/app-store.tsx` hydrates persisted state via `lib/storage.ts`.
- Feature components read and update state using `useAppStore()`.
- Persisted updates are written back to `localStorage` after hydration.

## Client and Server Boundaries

- Server component: `components/dashboard/dashboard-cards.tsx`.
- Client components: all feature views, app shell, theme toggle, and Base UI wrappers.
- Hydration skeletons render while `state.ui.isHydrated` is false.

## Folder Structure

```text
app/                 Routes, layout, global loading and error UI
components/          Feature components and layout
components/loading/  Skeletons for hydration states
components/ui/       Shared UI primitives and Base UI wrappers
context/             App store and theme provider
hooks/               Client hooks
lib/                 Models, utilities, and persistence helpers
```

## Styling and Theme

- Tailwind v4 is configured in `app/globals.css`.
- Theme variables are defined in `app/color-vars.css` and toggled via `next-themes`.
- `components/utility/theme-toggle.tsx` uses a view transition helper in `lib/view-transition.ts`.
