# Dependencies

## Runtime

| Package | Purpose |
|---------|---------|
| `next` | App Router framework and server rendering (16.x) |
| `react`, `react-dom` | UI runtime (React 19) |
| `@base-ui/react` | Headless UI primitives used by shadcn components |
| `shadcn` | UI component system (Tailwind + Base UI); styles in `app/globals.css` via `shadcn/tailwind.css` |
| `next-themes` | Theme management and system preference sync |
| `lucide-react` | Icon library |
| `class-variance-authority` (CVA) | Variant-based component styling |
| `clsx`, `tailwind-merge` | Conditional class names (`cn()` in `lib/utils.ts`) |
| `sonner` | Toast notifications; wrapped in `components/ui/sonner.tsx` (Toaster) and rendered in root layout |
| `tw-animate-css` | Tailwind animation utilities |

## Development

### Build & Tooling

| Package | Purpose |
|---------|---------|
| `typescript` | Type checking |
| `eslint`, `eslint-config-next` | Linting |
| `prettier` | Code formatting |
| `@ianvs/prettier-plugin-sort-imports` | Import sorting |
| `prettier-plugin-tailwindcss` | Tailwind class sorting |
| `tailwindcss`, `@tailwindcss/postcss` | Styling build pipeline |
| `babel-plugin-react-compiler` | React Compiler optimization |

### Testing

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner |
| `@vitest/ui` | Interactive test UI |
| `@vitest/coverage-v8` | Coverage reporting |
| `@vitejs/plugin-react` | React support for Vitest |
| `jsdom` | DOM environment for tests |
| `@testing-library/react` | React component testing utilities |
| `@testing-library/jest-dom` | Custom DOM matchers |
| `@testing-library/user-event` | User interaction simulation |

## Package Manager

The project uses [Bun](https://bun.sh/) as the package manager and runtime. All scripts in `package.json` use `bun --bun` for optimal performance.

## Version Requirements

- Node.js: 18+ (for Next.js 16)
- Bun: 1.0+ (recommended)
- React: 19.x
- Next.js: 16.x

## Adding and Removing Dependencies

Use Bun only (see AGENTS.md / CLAUDE.md):

```bash
bun add <package>           # Add dependency
bun add -d <package>        # Add dev dependency
bun remove <package>        # Remove dependency
```

## Updating Dependencies

```bash
# Check for updates
bunx npm-check-updates

# Update dependencies
bun update

# Verify after updates
bun run typecheck
bun run lint
bun run test:run
bun run build
```
