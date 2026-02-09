# Components

Reference for React components. All feature components are client components unless noted.

## Layout

| Component    | File                                    | Description                                                                                                               |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`   | `components/app-shell.tsx`              | Root layout: sidebar (collapsible) with **custom logo** (Next.js `Image` from `public/images/teacherbuddy-icon-transparent.png`, blur placeholder, responsive sizes), route titles, main content. Uses `getPageInfoByPath(pathname)` for meta; passes `meta` and `info` (currentPath, `PAGE_INFOS`) to `Header`. Optional `footer`. |
| `Header`     | `components/header.tsx`                 | Page title, description, **PageInfoDialog** (help button next to title), sidebar trigger, theme toggle, and **QuizTimerCard** (timer on all pages). Receives `meta` and `info` from AppShell. |
| `Footer`         | `components/footer.tsx`                 | Credits, source link, Catppuccin attribution. Rendered via `AppShell` footer prop.                                          |
| `PrivacyNotice` | `components/privacy-notice.tsx`         | One-time privacy notice bar (bottom center); explains local-only data, no tracking. Dismissal stored in localStorage; rendered in root layout. |
| `Toaster`       | `components/ui/sonner.tsx`             | Toast notifications (sonner). Rendered in root layout with `closeButton`, `position="bottom-center"`. Theme-aware icons.     |
| `SidebarNav`     | `components/navigation/sidebar-nav.tsx` | Primary navigation links; highlights current route by pathname.                                                             |
| `AppSidebar`     | `components/app-sidebar.tsx`            | Alternative sidebar component (see app-shell for active layout).                                                            |

## Dashboard

| Component        | File                                       | Description                                                                                                   |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `DashboardCards` | `components/dashboard/dashboard-cards.tsx` | **Server component** – feature tiles linking to students, generator, quizzes, play, breakout-rooms, projects. |

## Students

| Component              | File                                    | Description                                                |
| ---------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `StudentForm`          | `components/students/student-form.tsx`  | Add and import students (comma-separated or file).         |
| `StudentTable`         | `components/students/student-table.tsx` | Edit, exclude, delete students.                            |
| `StudentNameGenerator` | `components/student-name-generator.tsx` | Standalone name generator utility (root of `components/`). |

## Generator

| Component       | File                                      | Description                                           |
| --------------- | ----------------------------------------- | ----------------------------------------------------- |
| `GeneratorCard` | `components/generator/generator-card.tsx` | Random student draw with no-repeat-until-reset logic. |

## Quizzes

| Component        | File                                      | Description                             |
| ---------------- | ----------------------------------------- | --------------------------------------- |
| `QuizEditor`     | `components/quizzes/quiz-editor.tsx`      | Wrapper for create/edit quiz workflows. |
| `QuizEditorForm` | `components/quizzes/quiz-editor-form.tsx` | Unified quiz details, question editing, and JSON file import form. |
| `QuizSelector`   | `components/quizzes/quiz-selector.tsx`    | Shared quiz picker (dropdown).          |

## Play

| Component       | File                                  | Description                                                                                                                                                     |
| --------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QuizPlayCard`  | `components/play/quiz-play-card.tsx`  | Draw question + student pair, reveal answer.                                                                                                                    |
| `QuizTimerCard` | `components/play/quiz-timer-card.tsx` | Configurable countdown timer with alerts (10min, 5min, 1min, 0); used in **Header** on every page. Persists to localStorage; supports audio and volume control. |

## Breakout Rooms

| Component            | File                                           | Description                                                                                          |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `BreakoutGroupsCard` | `components/breakout/breakout-groups-card.tsx` | Group size config, generate random groups, copy groups/all to clipboard (uses `useCopyToClipboard`). |

## Projects

| Component            | File                                           | Description                                                                      |
| -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `ProjectListBuilder` | `components/projects/project-list-builder.tsx` | Create/edit project lists (name, type, description, student assignment, groups). |
| `ProjectListView`    | `components/projects/project-list-view.tsx`    | View and manage saved project lists.                                             |

## Utility

| Component        | File                                        | Description                                                                                                                                                       |
| ---------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ThemeToggle`    | `components/utility/theme-toggle.tsx`       | Dark/light/system theme switcher (uses `next-themes` and `lib/view-transition.ts` for transitions).                                                               |
| `PageInfoDialog` | `components/utility/page-info-dialog.tsx`  | Help button (next to page title in Header) that opens a modal with per-page tutorial: purpose, steps, outcome. Uses `lib/page-info` (`PageInfo`, `PAGE_INFOS`), Dialog, Select, Tabs, `useIsMobile`. |

Copy-to-clipboard is provided by the `useCopyToClipboard` hook; it is used inline in components (e.g. `BreakoutGroupsCard`) rather than as a standalone `CopyButton` component.

## Loading States

Feature pages pass a `skeleton` prop to the main component (e.g. `<StudentForm skeleton={<StudentFormSkeleton />} />`). Skeletons in `components/loading/` render while `state.ui.isHydrated` is false:

| Skeleton                | File                                 | Used By           |
| ----------------------- | ------------------------------------ | ----------------- |
| `StudentFormSkeleton`   | `student-form-skeleton.tsx`          | `/students`       |
| `StudentTableSkeleton`  | `student-table-skeleton.tsx`         | `/students`       |
| `GeneratorCardSkeleton` | `generator-card-skeleton.tsx`        | `/generator`      |
| `QuizEditorSkeleton`    | `quiz-editor-skeleton.tsx`           | `/quizzes`        |
| `QuizPlayCardSkeleton`  | `quiz-play-card-skeleton.tsx`        | `/play`           |
| (Breakout)              | Uses same or inline skeleton pattern | `/breakout-rooms` |

## UI Primitives

Base components in `components/ui/` use Tailwind and (where noted) Base UI / shadcn:

| Component                                        | Notes                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| `Button`                                         | CVA variants; use `button-variants.ts` for server-safe variants. |
| `Card`, `CardHeader`, etc.                       | Layout primitives.                                               |
| `Input`, `Textarea`                              | Form inputs.                                                     |
| `Select`, `Label`, `Field`                       | Form field wrappers.                                             |
| `Dialog`, `DialogContent`, `DialogTrigger`, etc. | Modal dialogs (used by PageInfoDialog, etc.).                    |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Tabbed content.                                                  |
| `AlertDialog`                                    | Confirmation dialogs.                                            |
| `Badge`                                          | Use `badge-variants.ts` for server-safe variants.                |
| `Checkbox`, `Combobox`, `Popover`, `Sheet`       | Headless-style UI.                                               |
| `DropdownMenu`, `Separator`, `Skeleton`, `Table` | Layout and feedback.                                             |
| `Sidebar`, `SidebarTrigger`, etc.                | Sidebar layout (used by AppShell).                               |
| `Toaster` (sonner)                               | Toast notifications; used in root layout.                        |
| `Tooltip`                                        | Accessibility-friendly tooltips.                                 |

### Server-Safe Variants

For RSC (e.g. dashboard cards), import variant functions only:

```typescript
import { badgeVariants } from '@/components/ui/badge-variants';
import { buttonVariants } from '@/components/ui/button-variants';
```

## Testing

Component tests:

- `StudentForm` – `components/students/__tests__/student-form.test.tsx`
- `QuizSelector` – `components/quizzes/__tests__/quiz-selector.test.tsx`
- `PageInfoDialog` – `components/utility/__tests__/page-info-dialog.test.tsx`

Use `renderWithProvider` from `__tests__/test-utils.tsx` so components have `AppStoreProvider` when they call `useAppStore()`.
