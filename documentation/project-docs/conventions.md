# Conventions

Code and documentation conventions for TeacherBuddy. Follow these when adding or changing code.

## Package Manager

- Use **Bun** only: `bun install`, `bun add`, `bun run`, `bunx`. Do not use npm or yarn.
- Scripts in `package.json` use `bun --bun` for the Next.js/vitest commands.

## TypeScript

- **No `any` or `unknown`** in type positions; use proper types or generics.
- Strict mode is enabled. Types are defined in `lib/models.ts`; use type guards from `lib/type-guards.ts` for runtime validation of persisted data.

## Comments and JSDoc

- Add **concise JSDoc** for exported functions and components: what it does, how to use it, what it expects, and what it returns.
- Avoid comments that only repeat the function or variable name.

## Naming

| Kind | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `StudentForm.tsx`, `QuizPlayCard.tsx` |
| Hooks | camelCase, `use` prefix | `use-timer.ts`, `use-copy-to-clipboard.ts` |
| Utilities | camelCase | `storage.ts`, `students.ts` |
| Test files | Same name + `.test` | `storage.test.ts`, `student-form.test.tsx` |
| Route folders | kebab-case | `breakout-rooms`, `project-docs` |

## File and Folder Placement

| Type | Location |
|------|----------|
| Route pages | `app/[feature]/page.tsx` |
| Feature components | `components/[feature]/` |
| Shared UI | `components/ui/` |
| Global state | `context/app-store.tsx` |
| Persistence | `lib/storage.ts` |
| Types | `lib/models.ts` |
| Type guards | `lib/type-guards.ts` |
| Custom hooks | `hooks/` |
| Tests | `__tests__/` next to source |

## Client vs Server

- Use `"use client"` for any component that uses hooks, context, or browser APIs.
- Server components: no directive; e.g. `DashboardCards` in `components/dashboard/`.
- For server-rendered UI that needs only styles, import **variant** modules (e.g. `button-variants.ts`, `badge-variants.ts`) instead of full client components.

## State and Hydration

- Check `state.ui.isHydrated` before rendering data-dependent UI; show a skeleton otherwise.
- Do not read `window` or `localStorage` during SSR. Persist only after hydration in effects.

## Documentation

- Project docs live in `documentation/project-docs/`. Keep them focused and up to date.
- When behavior or structure changes, update the relevant doc and the README if needed.
- Update `CHANGELOG.md` for user- or developer-visible changes.

## Quality Checks Before Commit

```bash
bun run lint
bun run typecheck
bun run test:run
bun run build   # optional but recommended
```

## Prettier and ESLint

- Prettier: run via editor or `bunx prettier --write .`
- ESLint: Next.js config; run with `bun run lint`
