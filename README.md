# TeacherBuddy

TeacherBuddy is a Next.js app for managing students, building quizzes, and running quick classroom activities from a single dashboard.

---

## Installation

**Prerequisites:** [Bun](https://bun.sh/) 1.0+ (or Node.js 18+).

```bash
git clone git@github.com:mrbubbles-src/teacherbuddy.git>
cd teacherbuddy
bun install

# Or with npm
npm install
```

> This project uses **Bun** as the package manager. Use `bun install`, `bun add`, and `bun run` (see [AGENTS.md](AGENTS.md)).

---

## Usage

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and use the dashboard to navigate.

### Features

| Route             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `/`               | Dashboard with links to all features                 |
| `/students`       | Manage classes and class-scoped student rosters      |
| `/generator`      | Draw random students with no-repeat logic per class  |
| `/quizzes`        | Build and edit quiz question sets                    |
| `/play`           | Run live quiz sessions scoped to selected class      |
| `/breakout-rooms` | Generate random student groups per class             |
| `/projects`       | Create and manage project lists per class            |

### Usage Examples

- **Import full classes**: Go to `/students` and import `.txt` with `Class Name: Student A, Student B` lines, or `.json` with `{ className, students }` objects.
- **Quick-add students**: In `/students`, use the student input or student `.txt` import to add names to the currently selected class.
- **Class-aware tools**: `/generator`, `/breakout-rooms`, `/projects`, and `/play` all use the active class selected in the class dropdown.
- **Random draw**: Go to `/generator` and click "Draw" to select a random active student (no repeats until reset).
- **Quiz play**: In `/play`, select a quiz, then draw question/student pairs and click to reveal answers.
- **Timer**: Use the **timer in the header** (on every page): set time, start countdown; alerts at 10min, 5min, 1min, and 0 (with optional sound).
- **Breakout groups**: In `/breakout-rooms`, set group size and generate; copy groups or full list to clipboard.
- **Project lists**: In `/projects`, create lists, assign students, and organize into groups.
- **In-app help**: Click the **?** (help) button next to the page title in the header to open a short tutorial for the current page (purpose, steps, outcome). Content is defined in `lib/page-info.tsx`.

---

## Architecture and Folder Structure

TeacherBuddy uses the **Next.js App Router** with **React 19**. State is persisted in `localStorage` and hydrated on the client.

```text
teacherbuddy/
├── app/                    # App Router routes and layouts
│   ├── layout.tsx          # Root layout (fonts, ThemeProvider, AppStoreProvider, AppShell)
│   ├── page.tsx            # Dashboard (server-rendered cards)
│   ├── loading.tsx        # Global loading state
│   ├── error.tsx           # Global error boundary
│   └── [feature]/          # Feature route pages (students, generator, quizzes, play, etc.)
├── components/             # React components
│   ├── ui/                 # Shared UI primitives (Button, Card, Sidebar, etc.)
│   ├── loading/            # Hydration skeleton components
│   ├── navigation/        # Sidebar navigation
│   ├── dashboard/         # Dashboard cards (server component)
│   ├── students/          # Student management
│   ├── classes/           # Class selector
│   ├── quizzes/           # Quiz builder
│   ├── play/              # Quiz play + timer card
│   ├── breakout/          # Breakout groups
│   ├── projects/           # Project lists
│   ├── utility/           # Theme toggle, etc.
│   ├── app-shell.tsx      # Layout shell (sidebar + header + main)
│   ├── header.tsx         # Page title, timer, theme toggle
│   └── footer.tsx         # Credits
├── context/                # React context
│   ├── app-store.tsx      # Global state and reducer
│   └── theme-provider.tsx  # next-themes
├── hooks/                  # Custom hooks (use-timer, use-copy-to-clipboard, etc.)
├── lib/                    # Utilities and types
│   ├── models.ts          # TypeScript types
│   ├── storage.ts         # localStorage persistence
│   ├── type-guards.ts     # Runtime validation
│   └── utils.ts           # Helpers (e.g. cn)
├── __tests__/              # Test utilities (e.g. renderWithProvider)
├── documentation/
│   └── project-docs/      # Detailed docs (see below)
├── vitest.config.ts
└── vitest.setup.ts
```

### Key Architectural Patterns

- **App Store**: `context/app-store.tsx` holds global state with `useReducer`, hydrated from `localStorage` on mount.
- **Hydration**: Components check `state.ui.isHydrated` and show skeletons until data is loaded.
- **Server components**: Dashboard cards are server-rendered; feature pages are client-driven.
- **Type guards**: `lib/type-guards.ts` validates persisted data from `localStorage`.

**Developer documentation** (components, state, hooks, testing, conventions): [documentation/project-docs/](documentation/project-docs/README.md).

---

## Configuration and Environment Variables

No environment variables are required for local development.

- **Persistence**: All app data is stored in the browser under `localStorage` with keys prefixed by `teacherbuddy:`.
- **React Compiler**: Enabled by default. To disable, set `NEXT_DISABLE_REACT_COMPILER=1` (see `next.config.ts`).
- **Metadata base URL (optional)**: Set `NEXT_PUBLIC_SITE_URL` so canonical, Open Graph, and Twitter metadata URLs resolve to your production domain.
- **Open Graph image**: The app serves a generated OG image through `app/api/og/route.ts` (`/api/og`) using `next/og`.

---

## Testing

TeacherBuddy uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

### Running Tests

```bash
bun run test          # Watch mode
bun run test:run     # Single run (e.g. CI)
bun run test:ui      # Interactive UI
bun run test:coverage # Coverage report
```

### Test Layout

Tests live in `__tests__/` next to source:

- `lib/__tests__/` – type-guards, storage, students
- `hooks/__tests__/` – use-timer, use-copy-to-clipboard
- `context/__tests__/` – app-reducer
- `components/*/__tests__/` – e.g. student-form, quiz-selector

Use `renderWithProvider` from `__tests__/test-utils.tsx` for components that need `AppStoreProvider`.

Full testing guide: [documentation/project-docs/testing.md](documentation/project-docs/testing.md).

---

## Quality Checks

```bash
bun run lint       # ESLint
bun run typecheck  # TypeScript
bun run test:run   # Tests
bun run build      # Production build
```

Run these before submitting changes.

---

## Contribution Guidelines

1. **Follow conventions** – See [documentation/project-docs/conventions.md](documentation/project-docs/conventions.md) (Bun, TypeScript, naming, where to put code).
2. **Keep changes focused** – Match existing patterns.
3. **Update documentation** – Adjust `documentation/project-docs/` when behavior or structure changes.
4. **Update CHANGELOG.md** – Record notable changes.
5. **Run quality checks** – `lint`, `typecheck`, and `test:run` must pass.
6. **Add tests** – Especially for new logic in `lib/`, `hooks/`, and `context/`.

### Code Style

- TypeScript strict mode; no `any`/`unknown` in type positions.
- Prettier for formatting (`bunx prettier --write .`).
- ESLint with Next.js config.
- JSDoc for exported functions and components where helpful.

---

## Tech Stack

| Category        | Technology                    |
| --------------- | ----------------------------- |
| Framework       | Next.js 16 (App Router)       |
| UI              | React 19                      |
| Styling         | Tailwind CSS v4, shadcn       |
| Components      | Base UI, Lucide icons         |
| State           | React Context + useReducer    |
| Persistence     | localStorage                  |
| Testing         | Vitest, React Testing Library |
| Language        | TypeScript                    |
| Package manager | Bun                           |

---

## License and Credits

- **License**: MIT. See [LICENSE](LICENSE).
- **Author**: [mrbubbles-src](https://mrbubbles-src.dev)
- **Source**: [TeacherBuddy on GitHub](https://github.com/mrbubbles-src/teacherbuddy)
- **Theme**: Color palette inspired by [Catppuccin](https://github.com/catppuccin/catppuccin)
- **Built with**: Next.js, React, Tailwind CSS
