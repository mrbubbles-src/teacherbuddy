# State and Storage

## App Store

The primary state lives in `context/app-store.tsx` and is accessed through `useAppStore()`.

### State Structure

```typescript
AppState {
  persisted: {
    students: Student[]
    quizIndex: QuizIndexEntry[]
    quizzes: Record<string, Quiz>
    projectLists: ProjectList[]
    breakoutGroups: BreakoutGroups | null
  }
  domain: {
    generator: GeneratorState      // Random draw state
    quizPlay: QuizPlayState        // Quiz play session state
  }
  ui: {
    quizEditor: { activeQuizId, editingQuestionId }
    isHydrated: boolean
  }
}
```

### State Categories

| Category | Persisted | Description |
|----------|-----------|-------------|
| `persisted` | Yes | Students, quizzes, project lists, breakout groups |
| `domain` | No | Ephemeral session state (generator, quiz play) |
| `ui` | No | Editor selection, hydration flag |

## Reducer Actions

### Student Actions

| Action | Effect |
|--------|--------|
| `ADD_STUDENT` | Add new student (rejects duplicates) |
| `UPDATE_STUDENT` | Update student name |
| `DELETE_STUDENT` | Remove student |
| `TOGGLE_STUDENT_EXCLUDED` | Toggle active/excluded status |
| `CLEAR_STUDENTS` | Remove all students |

### Quiz Actions

| Action | Effect |
|--------|--------|
| `CREATE_QUIZ` | Create new quiz, set as active |
| `UPDATE_QUIZ` | Update quiz title and questions |
| `DELETE_QUIZ` | Remove quiz |
| `SELECT_QUIZ_FOR_EDITOR` | Set active quiz in editor |
| `SET_EDITING_QUESTION` | Set question being edited |

### Quiz Play Actions

| Action | Effect |
|--------|--------|
| `SELECT_QUIZ_FOR_PLAY` | Load quiz for play session |
| `DRAW_QUIZ_PAIR` | Draw random question + student |
| `REVEAL_ANSWER` | Show answer for current question |
| `RESET_QUIZ_PLAY` | Clear session, keep quiz selected |

### Generator Actions

| Action | Effect |
|--------|--------|
| `DRAW_STUDENT` | Draw random active student (no repeat) |
| `RESET_GENERATOR` | Clear used students list |

### Other Actions

| Action | Effect |
|--------|--------|
| `SET_BREAKOUT_GROUPS` | Save breakout group configuration |
| `CLEAR_BREAKOUT_GROUPS` | Remove breakout groups |
| `CREATE_PROJECT_LIST` | Create new project list |
| `UPDATE_PROJECT_LIST` | Update project list |
| `DELETE_PROJECT_LIST` | Remove project list |
| `HYDRATE_PERSISTED` | Load state from localStorage |

## Persistence

### Storage Keys

All keys are prefixed with `teacherbuddy:`:

| Key | Data |
|-----|------|
| `teacherbuddy:students` | Student array |
| `teacherbuddy:quiz-index` | Quiz metadata array |
| `teacherbuddy:quiz:<id>` | Individual quiz data |
| `teacherbuddy:project-lists` | Project lists array |
| `teacherbuddy:breakout-groups` | Breakout configuration |
| `teacherbuddy:timer` | Timer persistence state |

### Persistence Flow

1. **Load**: On mount, `loadPersistedState()` reads all keys and validates with type guards
2. **Hydrate**: `HYDRATE_PERSISTED` action updates state, sets `isHydrated: true`
3. **Save**: After hydration, state changes trigger writes via `useEffect`

### Data Validation

`lib/type-guards.ts` provides runtime validation:

```typescript
isStudent(value)           // Validates Student shape
isQuiz(value)              // Validates Quiz shape
isQuestion(value)          // Validates Question shape
isBreakoutGroups(value)    // Validates BreakoutGroups shape
isProjectList(value)       // Validates ProjectList shape
isPersistedTimerState(value) // Validates timer state
```

Invalid data is filtered out during load to prevent crashes from corrupted localStorage.

### Legacy Migration

`loadStudents()` handles legacy format migration:
- Old format: `["Name1", "Name2"]` (string array)
- New format: `[{ id, name, status, createdAt }]` (Student objects)

## Timer Persistence

The timer (`hooks/use-timer.ts`) has separate persistence:

| Field | Purpose |
|-------|---------|
| `configuredTotalSeconds` | Original timer duration |
| `remainingSeconds` | Time remaining |
| `isRunning` | Whether timer was running |
| `savedAt` | Timestamp for elapsed time calculation |

On restore, elapsed time since `savedAt` is subtracted if the timer was running.

## Testing State

The app reducer is thoroughly tested in `context/__tests__/app-reducer.test.ts` with 39 tests covering all actions. Tests use `renderHook` with the `AppStoreProvider` wrapper to test state transitions.
