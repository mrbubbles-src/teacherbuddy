# Routes

## App Layout

- `app/layout.tsx` defines global fonts, providers, and the `AppShell` wrapper.
- `app/loading.tsx` provides a generic loading state for route transitions.
- `app/error.tsx` handles global runtime errors with a retry action.

## Pages

- `/` (`app/page.tsx`): Dashboard cards (server-rendered).
- `/students` (`app/students/page.tsx`): Student management form and roster.
- `/generator` (`app/generator/page.tsx`): Random student generator.
- `/quizzes` (`app/quizzes/page.tsx`): Quiz builder and import.
- `/play` (`app/play/page.tsx`): Quiz play mode.
