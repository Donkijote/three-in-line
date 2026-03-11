# Configuration Notes

- Web build config lives in `web/vite.config.ts`.
- Web TypeScript configs are in `web/tsconfig*.json`.
- Web package/runtime config lives in `web/package.json`, `web/index.html`, `web/wrangler.toml`, and `web/components.json`.
- Mobile Expo config lives in `mobile/app.json`.
- Mobile Metro config lives in `mobile/metro.config.js`.
- Mobile TypeScript config lives in `mobile/tsconfig.json`.
- Styling for web uses Tailwind via `src/ui/web/styles/globals.css`.
- Styling for mobile uses NativeWind v4 with Tailwind v3 via `src/ui/mobile/styles/global.css` and `mobile/tailwind.config.js`.
- Mobile reusables CLI config lives in `mobile/components.json`.
- TanStack Router uses `@tanstack/router-plugin` in Vite and generates `src/ui/web/routeTree.gen.ts`.
