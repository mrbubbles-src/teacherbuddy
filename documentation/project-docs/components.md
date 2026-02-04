# Components

## Layout

| Component | File | Description |
|-----------|------|-------------|
| `AppShell` | `components/app-shell.tsx` | Sidebar layout, route titles, header controls |
| `SidebarNav` | `components/navigation/sidebar-nav.tsx` | Primary navigation list |
| `QuickTimerDisplay` | `components/navigation/quick-timer-display.tsx` | Timer in sidebar |

## Dashboard

| Component | File | Description |
|-----------|------|-------------|
| `DashboardCards` | `components/dashboard/dashboard-cards.tsx` | Server component with feature tiles |

## Students

| Component | File | Description |
|-----------|------|-------------|
| `StudentForm` | `components/students/student-form.tsx` | Add and import students |
| `StudentTable` | `components/students/student-table.tsx` | Edit, exclude, delete students |

## Generator

| Component | File | Description |
|-----------|------|-------------|
| `GeneratorCard` | `components/generator/generator-card.tsx` | Random draw with no-repeat logic |

## Quizzes

| Component | File | Description |
|-----------|------|-------------|
| `QuizEditor` | `components/quizzes/quiz-editor.tsx` | Create, edit, import quizzes |
| `QuizEditorForm` | `components/quizzes/quiz-editor-form.tsx` | Quiz title and questions form |
| `QuizSelector` | `components/quizzes/quiz-selector.tsx` | Shared quiz picker dropdown |
| `QuizImportCard` | `components/quizzes/quiz-import-card.tsx` | Import quiz from file |

## Play

| Component | File | Description |
|-----------|------|-------------|
| `QuizPlayCard` | `components/play/quiz-play-card.tsx` | Draw question + student, reveal answers |

## Timer

| Component | File | Description |
|-----------|------|-------------|
| `QuizTimerCard` | `components/timer/quiz-timer-card.tsx` | Configurable timer with alerts |

## Breakout Rooms

| Component | File | Description |
|-----------|------|-------------|
| `BreakoutCard` | `components/breakout/breakout-card.tsx` | Group size config and generation |
| `BreakoutGroups` | `components/breakout/breakout-groups.tsx` | Display generated groups |

## Projects

| Component | File | Description |
|-----------|------|-------------|
| `ProjectListBuilder` | `components/projects/project-list-builder.tsx` | Create/edit project lists |
| `ProjectListView` | `components/projects/project-list-view.tsx` | View saved project lists |

## Utility

| Component | File | Description |
|-----------|------|-------------|
| `ThemeToggle` | `components/utility/theme-toggle.tsx` | Dark/light theme switcher |
| `CopyButton` | `components/utility/copy-button.tsx` | Copy to clipboard with feedback |

## Loading States

Skeletons in `components/loading/` render while `state.ui.isHydrated` is false:

| Component | Used By |
|-----------|---------|
| `StudentFormSkeleton` | `/students` |
| `StudentTableSkeleton` | `/students` |
| `GeneratorSkeleton` | `/generator` |
| `QuizEditorSkeleton` | `/quizzes` |
| `QuizPlaySkeleton` | `/play` |
| `BreakoutSkeleton` | `/breakout-rooms` |

## UI Primitives

Base components in `components/ui/` wrap `@base-ui/react` with Tailwind styling:

| Component | Base |
|-----------|------|
| `Button` | Custom with CVA variants |
| `Card`, `CardHeader`, etc. | Custom layout components |
| `Input` | Base UI input |
| `Select`, `SelectItem` | Base UI select |
| `Dialog`, `DialogContent` | Base UI dialog |
| `Badge` | Custom with variants |
| `Field`, `FieldLabel` | Form field wrapper |

### Server-Safe Variants

For RSC usage, import style functions directly:

```typescript
import { buttonVariants } from "@/components/ui/button-variants"
import { badgeVariants } from "@/components/ui/badge-variants"
```

## Testing

Component tests exist for:
- `StudentForm` (`components/students/__tests__/student-form.test.tsx`)
- `QuizSelector` (`components/quizzes/__tests__/quiz-selector.test.tsx`)

Tests use `renderWithProvider` from `__tests__/test-utils.tsx` to wrap components with `AppStoreProvider`.
