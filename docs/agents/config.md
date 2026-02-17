# Configuration Notes

- Web build config lives in `vite.config.ts`.
- Web TypeScript configs are in `tsconfig*.json`.
- Mobile Expo config lives in `mobile/app.json`.
- Mobile Metro config lives in `mobile/metro.config.js`.
- Mobile TypeScript config lives in `mobile/tsconfig.json`.
- Styling for web uses Tailwind via `src/ui/web/styles/globals.css`.
- Styling for mobile uses NativeWind v4 with Tailwind v3 via `mobile/global.css` and `mobile/tailwind.config.js`.
- Mobile reusables CLI config lives in `mobile/components.json` (separate from root `components.json` for web).
- TanStack Router uses `@tanstack/router-plugin` in Vite and generates `src/ui/web/routeTree.gen.ts`.
