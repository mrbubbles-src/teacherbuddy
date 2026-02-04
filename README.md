# TeacherBuddy

TeacherBuddy is a Next.js app for managing students, building quizzes, and running quick classroom activities from a single dashboard.

## Installation

```bash
# Install dependencies
bun install

# Or with npm
npm install
```

## Usage

Run the development server:

```bash
bun dev
```

Open http://localhost:3000 and use the dashboard to navigate.

### Features

| Route | Description |
|-------|-------------|
| `/students` | Add, import, edit, and manage student roster |
| `/generator` | Draw random students with no-repeat logic |
| `/quizzes` | Build and edit quiz question sets |
| `/play` | Run live quiz sessions with student pairing |
| `/breakout-rooms` | Generate random student groups |
| `/projects` | Create and manage project lists |

### Usage Examples

- **Add students**: Navigate to `/students`, type names (comma-separated for bulk) or import a `.txt` file.
- **Random draw**: Go to `/generator` and click "Draw" to select a random active student.
- **Quiz play**: In `/play`, select a quiz and draw question/student pairs. Click to reveal answers.
- **Timer**: Use the sidebar timer with configurable alerts at 10min, 5min, 1min, and 0.

## Architecture and Folder Structure

TeacherBuddy uses the Next.js App Router with React 19. State is persisted to `localStorage` and hydrated on the client.

```text
teacherbuddy/
├── app/                    # App Router routes and layouts
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Dashboard (server component)
│   ├── loading.tsx         # Global loading state
│   ├── error.tsx           # Global error boundary
│   └── [feature]/          # Feature route pages
├── components/             # React components
│   ├── ui/                 # Base UI primitives (Button, Card, etc.)
│   ├── loading/            # Hydration skeleton components
│   ├── navigation/         # Sidebar and navigation
│   ├── students/           # Student management components
│   ├── quizzes/            # Quiz builder components
│   ├── play/               # Quiz play components
│   └── ...                 # Other feature components
├── context/                # React context providers
│   ├── app-store.tsx       # Global app state and reducer
│   └── theme-provider.tsx  # Theme context (next-themes)
├── hooks/                  # Custom React hooks
│   ├── use-timer.ts        # Timer hook with persistence
│   ├── use-copy-to-clipboard.ts
│   └── ...
├── lib/                    # Utilities and helpers
│   ├── models.ts           # TypeScript type definitions
│   ├── storage.ts          # localStorage persistence
│   ├── students.ts         # Student name utilities
│   ├── type-guards.ts      # Runtime type validation
│   └── utils.ts            # General utilities (cn)
├── __tests__/              # Test utilities
├── documentation/          # Project documentation
│   └── project-docs/       # Detailed documentation files
├── vitest.config.ts        # Vitest configuration
└── vitest.setup.ts         # Test setup and mocks
```

### Key Architectural Patterns

- **App Store**: `context/app-store.tsx` manages global state with `useReducer`. State is hydrated from localStorage on mount.
- **Hydration Skeletons**: Components check `state.ui.isHydrated` and render skeletons until data loads.
- **Server Components**: Dashboard cards are server-rendered; feature pages are client-driven.
- **Type Guards**: Runtime validation in `lib/type-guards.ts` ensures data integrity from localStorage.

## Configuration and Environment Variables

No environment variables are required for local development.

All data is stored in the browser's `localStorage` under keys prefixed with `teacherbuddy:`.

## Testing

TeacherBuddy uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

### Running Tests

```bash
# Run tests in watch mode
bun run test

# Run tests once
bun run test:run

# Run tests with UI
bun run test:ui

# Run tests with coverage report
bun run test:coverage
```

### Test Structure

```text
lib/__tests__/              # Unit tests for utilities
  ├── type-guards.test.ts   # Type guard validation (85 tests)
  ├── students.test.ts      # Student name utilities (28 tests)
  └── storage.test.ts       # Storage functions (38 tests)
hooks/__tests__/            # Hook tests
  ├── use-timer.test.ts     # Timer hook (28 tests)
  └── use-copy-to-clipboard.test.ts (11 tests)
context/__tests__/          # State management tests
  └── app-reducer.test.ts   # Reducer actions (39 tests)
components/*/\_\_tests\_\_/ # Component tests
  ├── student-form.test.tsx
  └── quiz-selector.test.tsx
__tests__/
  └── test-utils.tsx        # Test utilities and providers
```

### Coverage

Current coverage targets core business logic:
- `lib/`: ~86% line coverage (type-guards, students, utils at 100%)
- `context/`: ~92% line coverage
- `hooks/`: use-timer ~82%, use-copy-to-clipboard 100%

## Quality Checks

```bash
# Linting
bun run lint

# Type checking
bun run typecheck

# Production build
bun run build
```

## Contribution Guidelines

1. **Keep changes focused** - Align with existing patterns and conventions.
2. **Update documentation** - Modify `documentation/project-docs/` when behavior changes.
3. **Update CHANGELOG.md** - Document notable changes.
4. **Run quality checks** - Ensure `lint`, `typecheck`, and `test:run` pass before submitting.
5. **Write tests** - Add tests for new functionality, especially in `lib/`, `hooks/`, and `context/`.

### Code Style

- TypeScript strict mode enabled
- Prettier for formatting (run via editor or `bunx prettier --write .`)
- ESLint with Next.js config

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Components | Base UI (headless), Lucide icons |
| State | React Context + useReducer |
| Persistence | localStorage |
| Testing | Vitest, React Testing Library |
| Language | TypeScript |

## License and Credits

MIT License. See [LICENSE](LICENSE) for details.

Built with Next.js, React, and Tailwind CSS.
