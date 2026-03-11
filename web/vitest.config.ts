import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

import path from "node:path";

const workspaceRoot = path.resolve(__dirname, "..");
const runtimePackages = [
  "@auth/core",
  "@base-ui/react",
  "@convex-dev/auth",
  "@tanstack/react-form",
  "@tanstack/react-router",
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@vitest/coverage-v8",
  "class-variance-authority",
  "clsx",
  "convex",
  "jsdom",
  "lucide-react",
  "radix-ui",
  "react",
  "react-dom",
  "shadcn",
  "tailwind-merge",
  "use-debounce",
  "vaul",
  "vitest",
] as const;
const webPackageAliases = Object.fromEntries(
  runtimePackages.map((packageName) => [
    packageName,
    path.resolve(__dirname, "node_modules", packageName),
  ]),
);

export default defineConfig({
  root: workspaceRoot,
  cacheDir: "./web/node_modules/.vite",
  plugins: [react()],
  resolve: {
    alias: {
      "@/convex": path.resolve(workspaceRoot, "convex"),
      "@": path.resolve(workspaceRoot, "src"),
      "shadcn/tailwind.css": path.resolve(
        __dirname,
        "node_modules/shadcn/dist/tailwind.css",
      ),
      "@fontsource-variable/noto-sans": path.resolve(
        __dirname,
        "node_modules/@fontsource-variable/noto-sans/index.css",
      ),
      tailwindcss: path.resolve(
        __dirname,
        "node_modules/tailwindcss/index.css",
      ),
      "tw-animate-css": path.resolve(
        __dirname,
        "node_modules/tw-animate-css/dist/tw-animate.css",
      ),
      ...webPackageAliases,
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    environment: "jsdom",
    setupFiles: ["./web/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "src/ui/mobile/**",
      "src/infrastructure/mobile/**",
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
      reportsDirectory: "./web/coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/ui/mobile/**",
        "src/infrastructure/mobile/**",
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
