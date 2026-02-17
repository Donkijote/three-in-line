# Project Structure

The codebase is organized around shared domain/application/infrastructure layers with UI adapters by platform.

- `src/ui/web/main.tsx` bootstraps the web app with `RouterProvider`.
- `src/ui/web/router.tsx` defines the TanStack Router instance.
- `src/ui/web/routes/` contains file-based routes (`__root.tsx`, `index.tsx`).
- `src/ui/web/modules/` groups web feature areas by screen and components.
- `src/ui/mobile/App.tsx` is the mobile UI adapter entrypoint consumed by Expo.
- `src/ui/mobile/application/providers/` contains mobile app-level providers.
- `src/ui/mobile/components/ui/` contains mobile reusable UI primitives (reusables-generated and project-owned).
- `src/ui/mobile/lib/` contains mobile UI helpers (`cn`, theme utilities, etc.).
- `src/ui/mobile/modules/` contains mobile feature modules/screens.
- `src/ui/mobile/styles/` stores mobile theme tokens and style primitives.
- `src/ui/shared/` contains cross-platform UI primitives and assets.
- `src/application/` contains use cases orchestrating domain logic.
- `src/domain/` contains entities and ports.
- `src/infrastructure/` contains repositories and external adapters (Convex, storage).
- `src/infrastructure/convex/repository/` contains Convex-backed repository implementations.
- `src/infrastructure/convex/GameApi.ts` and `src/infrastructure/convex/UserApi.ts` provide UI-safe Convex query hooks.
- `src/infrastructure/convex/auth.ts` wraps Convex auth helpers for UI use.
- `mobile/` contains Expo runtime/config files (`App.tsx`, `app.json`, `metro.config.js`, `tsconfig.json`) and mobile reusables config (`components.json`).
- `public/` holds static files served as-is for web.
- `scripts/` contains repo automation (e.g., `scripts/ghi-pr.sh`).
