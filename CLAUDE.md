---
description: Agent rules and guidelines
alwaysApply: true
---

- This project uses Bun as the package manager.
  - use `bun` instead of `npm` or `yarn`.
  - use `bun install` to install dependencies.
  - use `bun add <package>` to add a dependency
  - use `bun remove <package>` to remove a dependency.
  - use `bun run <script>` to run scripts.
  - use `bunx <package>` to run a package manager command.
  - to ensure it actually uses bun, use `bun --bun <command>`.
- Do not use `any` or `unknown` types.
- Add concise JSDoc comments that explain what the function or component is for, how to use it, what it expects, and what it returns — even if the implementation seems obvious.
- Avoid comments that merely restate the function name or implementation.
- use context7 mcp for latest documentations, when needed.
