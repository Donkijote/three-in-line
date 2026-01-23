# Project Structure

The codebase is organized for the web client only.

- `src/ui/web/main.tsx` bootstraps the app with `RouterProvider`.
- `src/ui/web/router.tsx` defines the TanStack Router instance.
- `src/ui/web/routes/` contains file-based routes (`__root.tsx`, `index.tsx`).
- `src/ui/web/modules/` groups feature areas by screen and components.
- `src/ui/web/components/` contains React components UI, including `components/ui`.
- `src/ui/web/layout/` contains app-wide layout wrappers.
- `src/ui/web/lib/` is for shared UI utilities and helpers.
- `src/ui/web/assets/` stores local images and static assets imported by the app.
- `src/ui/web/styles/` stores global styling like `globals.css`.
- `public/` holds static files served as-is.
- `scripts/` contains repo automation (e.g., `scripts/ghi-pr.sh`).
