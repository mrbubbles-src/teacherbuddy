# Components

## Layout

- `components/app-shell.tsx`: Sidebar layout, route titles, and header controls.
- `components/navigation/sidebar-nav.tsx`: Primary navigation list.

## Dashboard

- `components/dashboard/dashboard-cards.tsx`: Server component that renders dashboard tiles.

## Students

- `components/students/student-form.tsx`: Add and import students.
- `components/students/student-table.tsx`: Edit, exclude, and delete students.

## Generator

- `components/generator/generator-card.tsx`: Random draw with no-repeat logic.

## Quizzes

- `components/quizzes/quiz-editor.tsx`: Create, edit, and import quizzes.
- `components/quizzes/quiz-selector.tsx`: Shared quiz picker UI.

## Play

- `components/play/quiz-play-card.tsx`: Draw question + student and reveal answers.

## Utility

- `components/utility/theme-toggle.tsx`: Theme toggle using `next-themes`.

## Loading States

- `components/loading/*`: Skeletons used while the app store hydrates.

## UI Primitives

- `components/ui/*`: Base UI wrappers, Tailwind styling, and reusable primitives.
- `components/ui/button-variants.ts` and `components/ui/badge-variants.ts`: Server-safe style exports for RSC usage.
