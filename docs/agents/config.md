# Configuration Notes

- Web build config lives in `vite.config.ts`.
- Web TypeScript configs are in `tsconfig*.json`.
- Mobile Expo config lives in `mobile/app.json`.
- Mobile Metro config lives in `mobile/metro.config.js`.
- Mobile TypeScript config lives in `mobile/tsconfig.json`.
- Styling for web uses Tailwind via `src/ui/web/styles/globals.css`.
- Styling for mobile uses NativeWind (Tailwind) with `mobile/tailwind.config.js` and `mobile/global.css`.
- TanStack Router uses `@tanstack/router-plugin` in Vite and generates `src/ui/web/routeTree.gen.ts`.
