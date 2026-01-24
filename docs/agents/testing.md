# Testing

- Tests use Vitest with a JSDOM environment.
- Name tests `*.test.ts(x)` or `*.spec.ts(x)` under `src/`.
- `bun run test` runs a single pass with coverage.
- `bun run test -- --run` runs a single pass without coverage flags.
- Prefer direct React type/value imports (e.g., `import type { ComponentPropsWithoutRef } from "react"`) over `import * as React`.
