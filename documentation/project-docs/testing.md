# Testing

## Overview

TeacherBuddy uses [Vitest](https://vitest.dev/) as the test runner with [React Testing Library](https://testing-library.com/) for component testing. The test suite provides comprehensive coverage of core business logic.

## Configuration

### vitest.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["text", "html"],
      include: ["lib/**", "hooks/**", "context/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
```

### vitest.setup.ts

The setup file configures:
- `@testing-library/jest-dom` matchers
- Automatic cleanup after each test
- localStorage mock with spied methods
- `crypto.randomUUID` mock for consistent IDs

## Test Categories

### Unit Tests (lib/)

Pure function tests with no React dependencies.

| File | Tests | Description |
|------|-------|-------------|
| `type-guards.test.ts` | 85 | Validates all type guard functions with valid/invalid inputs |
| `students.test.ts` | 28 | Tests name normalization, key generation, formatting |
| `storage.test.ts` | 38 | Tests localStorage operations, data migration, validation |

### Hook Tests (hooks/)

Tests for custom React hooks using `renderHook`.

| File | Tests | Description |
|------|-------|-------------|
| `use-timer.test.ts` | 28 | Timer state, countdown, persistence, alert thresholds |
| `use-copy-to-clipboard.test.ts` | 11 | Clipboard operations, state management, reset behavior |

### Integration Tests (context/)

Tests for the app reducer through the AppStoreProvider.

| File | Tests | Description |
|------|-------|-------------|
| `app-reducer.test.ts` | 39 | All reducer actions: students, quizzes, generator, breakout groups |

### Component Tests (components/)

Integration tests for React components with user interactions.

| File | Tests | Description |
|------|-------|-------------|
| `student-form.test.tsx` | 8 | Form submission, validation, error states |
| `quiz-selector.test.tsx` | 10 | Selection, disabled states, dropdown behavior |
| `page-info-dialog.test.tsx` | — | PageInfoDialog: help modal, tabs, page selection (in `components/utility/__tests__/`) |

## Running Tests

```bash
# Watch mode (development)
bun run test

# Single run (CI)
bun run test:run

# Interactive UI
bun run test:ui

# With coverage report
bun run test:coverage
```

## Writing Tests

### Test File Location

Place test files in `__tests__/` directories adjacent to the code:

```text
lib/
├── students.ts
└── __tests__/
    └── students.test.ts
```

### Test Utilities

Use the custom render wrapper for components that need providers:

```typescript
import { renderWithProvider } from "@/__tests__/test-utils"

it("renders with app state", () => {
  renderWithProvider(<MyComponent />)
})
```

### Testing Hooks

```typescript
import { renderHook, act } from "@testing-library/react"

it("updates state", () => {
  const { result } = renderHook(() => useMyHook())

  act(() => {
    result.current.doSomething()
  })

  expect(result.current.value).toBe(expected)
})
```

### Testing with Fake Timers

```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it("handles time-based logic", async () => {
  // ...setup

  await act(async () => {
    vi.advanceTimersByTime(1000)
  })

  // ...assertions
})
```

### Testing localStorage

The localStorage mock is automatically available and spied:

```typescript
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

it("saves to localStorage", () => {
  // ...action that saves

  expect(localStorage.setItem).toHaveBeenCalledWith(
    "teacherbuddy:key",
    expect.any(String)
  )
})
```

## Coverage

Target coverage for core directories:

| Directory | Target | Current |
|-----------|--------|---------|
| `lib/` | >80% | ~86% |
| `context/` | >80% | ~92% |
| `hooks/` | >60% | ~53% (core hooks at 80-100%) |

Files with lower coverage are typically:
- Browser-dependent hooks (`use-mobile.ts`)
- Theme utilities (`use-theme.ts`, `theme-provider.tsx`)
- View transition helpers

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how.
2. **Use descriptive test names** - `it("returns empty array for invalid JSON")`.
3. **Isolate tests** - Clear mocks and state in `beforeEach`.
4. **Avoid testing library internals** - Trust React and Base UI behavior.
5. **Keep tests fast** - Use fake timers, avoid unnecessary waits.

## Debugging Tests

```bash
# Run specific test file
bun run test lib/__tests__/storage.test.ts

# Run tests matching pattern
bun run test -t "loadStudents"

# Debug mode
bun run test --inspect-brk
```

## CI Integration

The test suite runs with `bun run test:run` which exits with code 0 on success. Integrate into CI pipelines alongside lint and typecheck:

```yaml
- run: bun run lint
- run: bun run typecheck
- run: bun run test:run
- run: bun run build
```
