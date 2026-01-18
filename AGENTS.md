# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript app.

- `src/main.tsx` bootstraps the app, `src/App.tsx` holds the root UI.
- `src/components/` contains reusable React components.
- `src/lib/` is for shared utilities and helpers.
- `src/assets/` stores local images and static assets imported by the app.
- `public/` holds static files served as-is.
- `scripts/` contains repo automation (e.g., `scripts/ghi-pr.sh`).

## Build, Test, and Development Commands
Use Bun (preferred) or npm to run scripts from `package.json`.

- `bun run dev` (or `npm run dev`): start the Vite dev server.
- `bun run build` (or `npm run build`): run TypeScript build then create a production bundle.
- `bun run test` (or `npm run test`): run Vitest in watch mode.
- `bun run preview` (or `npm run preview`): preview the production build locally.
- `bun run lint` (or `npm run lint`): run Biome with auto-fix.

## Coding Style & Naming Conventions
- Formatting and linting are handled by Biome (`biome.json`).
- Indentation is 2 spaces; quotes are double in JS/TS.
- React components use PascalCase (e.g., `GameBoard.tsx`).
- Hooks use `use*` naming (e.g., `useGameState.ts`).

## Testing Guidelines
Tests use Vitest with a JSDOM environment.

- Name tests `*.test.ts(x)` or `*.spec.ts(x)` under `src/`.
- Run `bun run test` for watch mode; use `bun run test -- --run` for a single pass.

## Commit & Pull Request Guidelines
Recent commits use a lightweight convention with a type prefix and optional issue tags.

- Prefer `chore:`, `refactor:`, `feat:`, `fix:` style prefixes.
- Issue references appear as `[GHI#<id>]` when applicable.
- Keep messages short and action-oriented.

For pull requests, include a clear summary, link any related issues, and add screenshots when UI changes are involved.

## Configuration Notes
- Vite config lives in `vite.config.ts`.
- TypeScript configs are in `tsconfig*.json`.
- Styling uses Tailwind via `src/index.css`.
