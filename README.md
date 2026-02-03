# TeacherBuddy

TeacherBuddy is a Next.js app for managing students, building quizzes, and running quick classroom activities from a single dashboard.

## Installation

```bash
bun install
```

## Usage

Run the dev server:

```bash
bun dev
```

Open http://localhost:3000 and use the dashboard to navigate.

Usage examples:
- Add or import students in `/students`.
- Draw a random student in `/generator`.
- Build and edit quizzes in `/quizzes`.
- Run live quiz play in `/play`.

## Architecture and Folder Structure

TeacherBuddy uses the Next.js App Router. Local state is persisted to `localStorage` and hydrated on the client.

```text
app/                 App Router routes, layout, global loading/error
components/          UI, feature, and layout components
components/loading/  Hydration skeletons for feature views
components/ui/       Base UI wrappers and shared UI primitives
context/             App store and providers
hooks/               Client hooks (theme, viewport)
lib/                 Models, storage, and utilities
public/              Static assets
```

Key architectural notes:
- `AppShell` wraps all routes with sidebar navigation and header meta.
- `context/app-store.tsx` stores student/quiz data and persists to `localStorage`.
- The dashboard cards are server-rendered; feature pages remain client-driven.

More detailed docs live in `documentation/project-docs/`.

## Configuration and Environment Variables

No environment variables are required for local development.

## Testing and Quality

Run linting:

```bash
bun run lint
```

Run TypeScript type checks:

```bash
bun run typecheck
```

Build to verify production output:

```bash
bun run build
```

## Contribution Guidelines

- Keep changes focused and aligned with existing patterns.
- Update docs in `documentation/project-docs/` when behavior changes.
- Update `CHANGELOG.md` for notable changes.
- Run `bun run lint` and `bun run typecheck` before submitting.

## License

MIT. See `LICENSE`.
