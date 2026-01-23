import { defineConfig } from "vitest/config";

import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "src/ui/web/components/ui/**",
      "src/infrastructure/convex/**",
      "src/ui/web/routes/**",
      "src/ui/web/main.tsx",
      "src/ui/web/router.tsx",
      "src/ui/web/routeTree.gen.ts",
      "convex/**",
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/ui/web/components/ui/**",
        "src/infrastructure/convex/**",
        "src/ui/web/routes/**",
        "src/ui/web/main.tsx",
        "src/ui/web/router.tsx",
        "src/ui/web/routeTree.gen.ts",
        "convex/**",
      ],
    },
  },
});
