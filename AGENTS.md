# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript app using TanStack Router. The current codebase is organized for the web client only.

- `src/ui/web/main.tsx` bootstraps the app with `RouterProvider`.
- `src/ui/web/router.tsx` defines the TanStack Router instance.
- `src/ui/web/routes/` contains file-based routes (`__root.tsx`, `index.tsx`).
- `src/ui/web/modules/` groups feature areas by screen and components.
- `src/ui/web/components/` contains React components UI, including `components/ui`.
- `src/ui/web/lib/` is for shared UI utilities and helpers.
- `src/ui/web/assets/` stores local images and static assets imported by the app.
- `src/ui/web/styles/` stores global styling like `globals.css`.
- `public/` holds static files served as-is.
- `scripts/` contains repo automation (e.g., `scripts/ghi-pr.sh`).

## Routing Conventions
- File-based routes live in `src/ui/web/routes/`.
- `__root.tsx` is the root layout; `index.tsx` maps to `/`.
- Use nested folders/files for nested URLs.
- Shared UI stays in `src/ui/web/components/`; keep route components thin.

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
- Prefer absolute imports with `@/` when possible.
- Relative imports are allowed inside `src/ui/web/components/**` when importing sibling or nested child components (use `./` or `../` only).

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
- Styling uses Tailwind via `src/ui/web/styles/globals.css`.
- TanStack Router uses `@tanstack/router-plugin` in Vite and generates `src/ui/web/routeTree.gen.ts`.
