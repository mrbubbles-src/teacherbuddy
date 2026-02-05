# Getting Started

A guide for developers new to the TeacherBuddy codebase. For a full list of docs, see [README.md](README.md) in this folder.

## Prerequisites

- [Bun](https://bun.sh/) 1.0+ (or Node.js 18+)
- Familiarity with React 19, TypeScript, and Next.js App Router

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd teacherbuddy
bun install

# Start development server
bun dev

# Open http://localhost:3000
```

## Project Overview

TeacherBuddy is a classroom management tool with these features:

| Feature | Route | Purpose |
|---------|-------|---------|
| Students | `/students` | Manage student roster |
| Generator | `/generator` | Random student selection |
| Quizzes | `/quizzes` | Build quiz question sets |
| Play | `/play` | Run quiz sessions |
| Breakout Rooms | `/breakout-rooms` | Generate student groups |
| Projects | `/projects` | Track project assignments |

## Key Concepts

### State Management

All state flows through `context/app-store.tsx`:

```typescript
const { state, actions } = useAppStore()

// state.persisted - Data saved to localStorage
// state.domain    - Session state (generator, quiz play)
// state.ui        - UI state (editor selection, hydration)

// actions.addStudent("Name")
// actions.createQuiz("Title", questions)
```

### Hydration Pattern

Components render skeletons until localStorage data loads:

```typescript
if (!state.ui.isHydrated) {
  return <MySkeleton />
}

return <MyComponent data={state.persisted.students} />
```

### Type Guards

Data from localStorage is validated at runtime:

```typescript
import { isStudent } from "@/lib/type-guards"

const data = JSON.parse(localStorage.getItem("key"))
if (isStudent(data)) {
  // data is typed as Student
}
```

## Development Workflow

### Making Changes

1. Understand existing patterns by reading similar code
2. Check related documentation in `documentation/project-docs/`
3. Write tests for new functionality
4. Run quality checks before committing

### Quality Checks

```bash
bun run lint       # ESLint
bun run typecheck  # TypeScript
bun run test:run   # Vitest
bun run build      # Production build
```

### Testing

Tests live in `__tests__/` directories adjacent to source:

```bash
# Run all tests
bun run test:run

# Run specific test file
bun run test lib/__tests__/storage.test.ts

# Watch mode for development
bun run test

# Coverage report
bun run test:coverage
```

For component tests, use the provider wrapper:

```typescript
import { renderWithProvider } from "@/__tests__/test-utils"

it("renders correctly", () => {
  renderWithProvider(<MyComponent />)
  expect(screen.getByText("Expected")).toBeInTheDocument()
})
```

## Code Organization

### Where to Put Things

| Type | Location |
|------|----------|
| Page routes | `app/[feature]/page.tsx` |
| Feature components | `components/[feature]/` |
| Shared UI | `components/ui/` |
| State logic | `context/app-store.tsx` |
| Utilities | `lib/` |
| Custom hooks | `hooks/` |
| Tests | Adjacent `__tests__/` folder |

### Naming Conventions

- Components: PascalCase (`StudentForm.tsx`)
- Hooks: camelCase with `use` prefix (`use-timer.ts`)
- Utilities: camelCase (`storage.ts`)
- Tests: Same name with `.test` suffix (`storage.test.ts`)

## Common Tasks

### Adding a New Feature

1. Create route in `app/[feature]/page.tsx`
2. Add components in `components/[feature]/`
3. Add state/actions to `context/app-store.tsx` if needed
4. Add persistence in `lib/storage.ts` if needed
5. Add page metadata and in-app help in `lib/page-info.tsx` (add an entry to `PAGE_INFOS` so the header title/description and PageInfoDialog work for the new route)
6. Create skeleton in `components/loading/`
7. Add tests for new functionality
8. Update documentation

### Adding State

1. Define types in `lib/models.ts`
2. Add type guard in `lib/type-guards.ts`
3. Add storage functions in `lib/storage.ts`
4. Add actions in `context/app-store.tsx`
5. Update `loadPersistedState()` if persisted
6. Write tests for all new code

### Adding a UI Component

1. Create in `components/ui/`
2. Wrap Base UI primitive or build custom
3. Use CVA for variants if needed
4. Export server-safe variants in separate file if used in RSC

## Troubleshooting

### Hydration Mismatch

- Ensure components check `state.ui.isHydrated`
- Don't access `window`/`localStorage` during SSR
- Use `"use client"` directive for client components

### Test Failures

- Check if localStorage mock is cleared in `beforeEach`
- Use `act()` for state updates in hook tests
- Use `waitFor()` for async component updates

### Type Errors

- Run `bun run typecheck` for full error list
- Check type guards match model definitions
- Ensure action payloads match expected types

## Resources

- **In-repo**: [documentation/project-docs/](README.md) – component reference, state, hooks, testing, conventions
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19](https://react.dev/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Base UI](https://base-ui.com/)
