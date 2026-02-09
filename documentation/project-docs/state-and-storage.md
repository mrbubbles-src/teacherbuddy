# State and Storage

## App Store

The primary state lives in `context/app-store.tsx` and is accessed through `useAppStore()`.

### State Structure

```typescript
AppState {
  persisted: {
    classes: Classroom[]
    activeClassId: string | null
    students: Student[]
    quizIndex: QuizIndexEntry[]
    quizzes: Record<string, Quiz>
    projectLists: ProjectList[]
    breakoutGroupsByClass: Record<string, BreakoutGroups>
  }
  domain: {
    generator: GeneratorState      // Random draw state (class scoped)
    quizPlay: QuizPlayState        // Quiz play session state (class scoped)
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
| `persisted` | Yes | Classes, students, quizzes, project lists, breakout groups |
| `domain` | No | Ephemeral session state (generator, quiz play) |
| `ui` | No | Editor selection and hydration flag |

## Reducer Actions

### Class Actions

| Action | Effect |
|--------|--------|
| `ADD_CLASS` | Add a class (dedupe by normalized class name) |
| `SELECT_ACTIVE_CLASS` | Switch active class and prune class-scoped domain state |
| `DELETE_CLASS` | Remove one class and all class-scoped data |
| `CLEAR_CLASSES` | Remove all classes and all class-scoped data |
| `IMPORT_CLASS_RECORDS` | Import class + student records from `.txt`/`.json` payloads |

### Student Actions

| Action | Effect |
|--------|--------|
| `ADD_STUDENT` | Add student to active class (reject duplicates inside class) |
| `UPDATE_STUDENT` | Update student name and/or class assignment |
| `DELETE_STUDENT` | Remove one student |
| `TOGGLE_STUDENT_EXCLUDED` | Toggle active/excluded status |
| `CLEAR_STUDENTS` | Remove all students in active class |

### Quiz Actions

| Action | Effect |
|--------|--------|
| `CREATE_QUIZ` | Create new quiz and set as active in editor |
| `UPDATE_QUIZ` | Update quiz title and questions |
| `DELETE_QUIZ` | Remove quiz |
| `SELECT_QUIZ_FOR_EDITOR` | Set active quiz in editor |
| `SET_EDITING_QUESTION` | Set question currently being edited |

### Quiz Play Actions

| Action | Effect |
|--------|--------|
| `SELECT_QUIZ_FOR_PLAY` | Load quiz for play session |
| `DRAW_QUIZ_PAIR` | Draw random question + active student from active class |
| `REVEAL_ANSWER` | Show answer for current question |
| `RESET_QUIZ_PLAY` | Clear session while keeping selected quiz |

### Generator and Group Actions

| Action | Effect |
|--------|--------|
| `DRAW_STUDENT` | Draw random active student from active class (no repeats) |
| `RESET_GENERATOR` | Clear used student history |
| `SET_BREAKOUT_GROUPS` | Save breakout groups for class |
| `CLEAR_BREAKOUT_GROUPS` | Remove breakout groups for active class |
| `CREATE_PROJECT_LIST` | Create project list tied to active class |
| `UPDATE_PROJECT_LIST` | Update a project list |
| `DELETE_PROJECT_LIST` | Remove a project list |
| `HYDRATE_PERSISTED` | Load persisted state from localStorage |

## Persistence

### Storage Keys

All keys are prefixed with `teacherbuddy:`:

| Key | Data |
|-----|------|
| `teacherbuddy:classes` | Class list |
| `teacherbuddy:active-class` | Active class ID |
| `teacherbuddy:students` | Student array (class-aware) |
| `teacherbuddy:quiz-index` | Quiz metadata array |
| `teacherbuddy:quiz:<id>` | Individual quiz payload |
| `teacherbuddy:project-lists` | Project list array |
| `teacherbuddy:breakout-groups` | Breakout groups keyed by class ID |
| `teacherbuddy:timer` | Timer persistence state |

### Persistence Flow

1. **Load**: `loadPersistedState()` reads localStorage and validates/migrates legacy formats.
2. **Hydrate**: `HYDRATE_PERSISTED` updates app state and sets `isHydrated: true`.
3. **Save**: A post-hydration `useEffect` writes class, student, quiz, project, and breakout updates.

### Data Validation

`lib/type-guards.ts` provides runtime validation:

```typescript
isClassroom(value)
isStudent(value)
isQuiz(value)
isQuestion(value)
isBreakoutGroups(value)
isProjectList(value)
isPersistedTimerState(value)
```

Invalid payloads are filtered out during load to prevent crashes from corrupt storage.

### Legacy Migration

`lib/storage.ts` keeps backward compatibility by migrating older payloads:

- Legacy student string arrays -> class-aware `Student[]`
- Legacy student objects without `classId` -> assigned to fallback class
- Legacy project lists and breakout payloads -> class-aware structures

## Timer Persistence

Timer persistence (`hooks/use-timer.ts`) is separate from app store persistence:

| Field | Purpose |
|-------|---------|
| `configuredTotalSeconds` | Configured timer duration |
| `remainingSeconds` | Time left |
| `isRunning` | Running state |
| `savedAt` | Timestamp used to compute elapsed time |

On restore, elapsed time since `savedAt` is subtracted when `isRunning` is true.

## Testing State

Reducer and storage behavior are covered in:

- `context/__tests__/app-reducer.test.ts`
- `lib/__tests__/storage.test.ts`
- `lib/__tests__/type-guards.test.ts`
