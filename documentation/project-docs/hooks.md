# Hooks

Custom React hooks in the `hooks/` directory.

## useTimer

**File**: `hooks/use-timer.ts`

Configurable countdown timer with persistence and alert thresholds.

### Usage

```typescript
const {
  displaySeconds,
  formattedTime,      // "01:30:00"
  isRunning,
  isAlerting,
  hours, minutes, seconds,
  setHours, setMinutes, setSeconds,
  start, pause, reset,
  hasTimeConfigured,
} = useTimer({
  alertThresholds: [600, 300, 60, 0],  // 10min, 5min, 1min, 0
  alertDuration: 5000,
})
```

### Features

- Configurable alert thresholds trigger visual/audio feedback
- Persists to localStorage (survives page refresh)
- Accounts for elapsed time when restoring a running timer
- Input changes automatically reset the timer

### Exported Utilities

```typescript
import { formatTime } from "@/hooks/use-timer"

formatTime(3661)  // "01:01:01"
```

### Test Coverage

28 tests in `hooks/__tests__/use-timer.test.ts` covering:
- Initialization and input handling
- Start, pause, reset behavior
- Countdown and stop-at-zero logic
- Alert threshold triggering

---

## useCopyToClipboard

**File**: `hooks/use-copy-to-clipboard.ts`

Clipboard operations with copy state feedback.

### Usage

```typescript
const { copy, isCopied, reset } = useCopyToClipboard(2000)

await copy("text to copy")  // Returns true on success

// isCopied is true for 2000ms after successful copy
```

### Features

- Returns success/failure boolean
- `isCopied` auto-resets after configurable delay
- Manual `reset()` for immediate clear
- Handles empty strings and clipboard errors

### Test Coverage

11 tests in `hooks/__tests__/use-copy-to-clipboard.test.ts` covering:
- Success and error scenarios
- State management and auto-reset
- Multiple rapid copies

---

## useAppStore

**File**: `context/app-store.tsx`

Global state access via React context.

### Usage

```typescript
const { state, actions } = useAppStore()

// Read state
state.persisted.students
state.ui.isHydrated

// Dispatch actions
actions.addStudent("John Doe")
actions.drawStudent()
actions.createQuiz("Math Quiz", [])
```

### Note

Must be used within `AppStoreProvider`. Throws error if used outside.

---

## useMobile

**File**: `hooks/use-mobile.ts`

Viewport width detection for responsive behavior.

### Usage

```typescript
const isMobile = useMobile()

// Returns true for viewport < 768px
```

### Note

Uses `window.matchMedia` with resize listener. Returns `false` during SSR.

---

## useTheme

**File**: `hooks/use-theme.ts`

Theme state access (wraps `next-themes`).

### Usage

```typescript
const { theme, setTheme, resolvedTheme } = useTheme()

// resolvedTheme is actual theme when "system" is selected
```

---

## useStudentGenerator

**File**: `hooks/use-student-generator.ts`

Higher-level hook combining app store with generator UI logic.

### Usage

```typescript
const {
  students,
  currentStudent,
  availableCount,
  draw,
  reset,
  excludeDrawn,
} = useStudentGenerator()
```

### Features

- Filters active students only
- Tracks used students (no repeats until reset)
- Provides exclude action for current student
