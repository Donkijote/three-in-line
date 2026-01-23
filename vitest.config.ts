import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "src/ui/web/components/ui/**",
      "src/infrastructure/convex/**",
      "convex/**",
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/ui/web/components/ui/**",
        "src/infrastructure/convex/**",
        "convex/**",
      ],
    },
  },
});
