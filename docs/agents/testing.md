# Testing

- Tests use Vitest with a JSDOM environment.
- Name tests `*.test.ts(x)` or `*.spec.ts(x)` under `src/`.
- `bun run test` runs the web test suite once with coverage through the root orchestrator package.
- `bun run web:test:watch` runs the web Vitest watcher from the web context.
- After any test-related change (creating, editing, updating, or fixing tests), always run the `bun run test` command from `package.json`, review the report, fix failures, and improve coverage when needed.
- Prefer direct React type/value imports (e.g., `import type { ComponentPropsWithoutRef } from "react"`) over `import * as React`.
- Don't import anything from `vitest` (e.g., `import { describe, expect, it, vi } from "vitest";`) because it's configured to work without it as globals
