# Structure

## Overview

TeacherBuddy is a Next.js App Router application. The layout renders a client-driven `AppShell` that provides navigation, header metadata, and global theming. Feature routes use local state stored in `localStorage` and hydrated on the client.

## Data Flow

1. On mount, `context/app-store.tsx` hydrates persisted state via `lib/storage.ts`.
2. Feature components read and update state using `useAppStore()`.
3. Persisted updates are written back to `localStorage` after hydration.

## Client and Server Boundaries

- **Server components**: `components/dashboard/dashboard-cards.tsx`
- **Client components**: Feature views, app shell, theme toggle, Base UI wrappers
- **Hydration skeletons**: Render while `state.ui.isHydrated` is false

## Folder Structure

```text
teacherbuddy/
├── app/                    # Routes, layout, global loading and error UI
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Dashboard
│   ├── loading.tsx         # Global loading state
│   ├── error.tsx           # Global error boundary
│   ├── students/           # Student management route
│   ├── generator/          # Random student generator route
│   ├── quizzes/            # Quiz builder route
│   ├── play/               # Quiz play route
│   ├── breakout-rooms/     # Breakout groups route
│   └── projects/           # Project lists route
├── components/             # React components
│   ├── ui/                 # Shared UI primitives and Base UI wrappers
│   ├── loading/            # Skeletons for hydration states
│   ├── navigation/         # Sidebar and nav components
│   ├── dashboard/          # Dashboard cards (server component)
│   ├── students/           # Student feature components
│   │   └── __tests__/      # Student component tests
│   ├── quizzes/            # Quiz feature components
│   │   └── __tests__/      # Quiz component tests
│   ├── play/               # Quiz play components
│   ├── generator/          # Generator components
│   ├── breakout/           # BreakoutGroupsCard
│   ├── projects/           # ProjectListBuilder, ProjectListView
│   ├── utility/            # ThemeToggle, PageInfoDialog
│   │   └── __tests__/      # PageInfoDialog tests
│   ├── app-shell.tsx       # Root layout shell
│   ├── header.tsx          # Page header (timer in header)
│   ├── footer.tsx          # Credits footer
│   └── student-name-generator.tsx
├── context/                # React context providers
│   ├── app-store.tsx       # Global state and reducer
│   ├── theme-provider.tsx  # next-themes wrapper
│   └── __tests__/          # Context tests
├── hooks/                  # Custom React hooks
│   ├── use-timer.ts        # Timer with persistence
│   ├── use-copy-to-clipboard.ts
│   ├── use-mobile.ts       # Viewport detection
│   ├── use-theme.ts        # Theme utilities
│   └── __tests__/          # Hook tests
├── lib/                    # Utilities and helpers
│   ├── models.ts           # TypeScript type definitions
│   ├── storage.ts          # localStorage persistence
│   ├── students.ts         # Student name utilities
│   ├── type-guards.ts      # Runtime type validation
│   ├── utils.ts            # General utilities
│   ├── page-info.tsx       # Page metadata and in-app help content (PAGE_INFOS, PAGE_INFO_BY_PATH)
│   ├── view-transition.ts  # Theme transition helper
│   └── __tests__/          # Utility tests
├── __tests__/              # Global test utilities
│   └── test-utils.tsx      # Custom render with providers
├── documentation/          # Project documentation
│   └── project-docs/       # Detailed docs
├── public/                 # Static assets
├── vitest.config.ts        # Test configuration
└── vitest.setup.ts         # Test setup and mocks
```

## Testing Structure

Tests are colocated with source code in `__tests__/` directories:

| Location | Coverage |
|----------|----------|
| `lib/__tests__/` | Type guards, storage, student utilities |
| `hooks/__tests__/` | useTimer, useCopyToClipboard |
| `context/__tests__/` | App reducer actions |
| `components/*/__tests__/` | Component integration tests |
| `__tests__/test-utils.tsx` | Shared test utilities |

## Styling and Theme

- Tailwind v4 and shadcn styles in `app/globals.css` (`@import 'tailwindcss'`, `@import 'shadcn/tailwind.css'`).
- Theme variables (Catppuccin Latte/Mocha) live in `app/globals.css` (`:root` and `.dark`); toggled via `next-themes` (`ThemeProvider` in root layout).
- `components/utility/theme-toggle.tsx` uses `lib/view-transition.ts` for smooth theme transitions.

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout: fonts (Geist), ThemeProvider, AppStoreProvider, AppShell, Footer |
| `context/app-store.tsx` | Central state: reducer, useAppStore, hydration, persistence effects |
| `lib/storage.ts` | localStorage read/write and validation |
| `lib/type-guards.ts` | Runtime type checking for persisted data |
| `lib/models.ts` | Shared TypeScript types (Student, Quiz, ProjectList, etc.) |
| `lib/page-info.tsx` | Page metadata and help content (PageInfo, PAGE_INFOS, PAGE_INFO_BY_PATH); drives Header meta and PageInfoDialog |
| `components/app-shell.tsx` | Layout: SidebarProvider, sidebar nav, Header (meta + info), main content |
| `components/header.tsx` | Page meta, PageInfoDialog, SidebarTrigger, ThemeToggle, QuizTimerCard |
| `next.config.ts` | Next config; React Compiler enabled unless `NEXT_DISABLE_REACT_COMPILER=1` |
| `vitest.config.ts` | Vitest + jsdom, path alias `@`, coverage for lib/hooks/context |
| `vitest.setup.ts` | jest-dom, cleanup, localStorage/crypto mocks |
