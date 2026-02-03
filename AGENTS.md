# Repository Guidelines

Vite + React + TypeScript web client using TanStack Router (and Convex auth).

Package manager: Bun (preferred).

Non-standard commands:
- `bun run test` (single run with coverage).

Boundary rule:
- UI must not import Convex types or `convex/*` directly; use infrastructure adapters and domain types.

More details:
- `docs/agents/structure.md`
- `docs/agents/routing.md`
- `docs/agents/coding-style.md`
- `docs/agents/testing.md`
- `docs/agents/git.md`
- `docs/agents/config.md`
