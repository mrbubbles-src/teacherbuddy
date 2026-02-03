# State and Storage

## App Store

The primary state lives in `context/app-store.tsx` and is accessed through `useAppStore()`.

- Students, quizzes, and quiz index are persisted.
- Generator and play mode state are derived from the persisted data.
- UI state tracks editor selection and hydration.

## Persistence

Local storage keys are managed in `lib/storage.ts`:
- `teacherbuddy:students`
- `teacherbuddy:quiz-index`
- `teacherbuddy:quiz:<id>`

Persisted state loads on client mount and writes back after hydration. Hydration is tracked by `state.ui.isHydrated` and is used to show skeletons while data loads.
