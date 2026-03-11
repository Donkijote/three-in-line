import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json") as { version?: string };
const appVersion = packageJson.version ?? "0.0.0";
const buildNumber =
  process.env.BUILD_NUMBER ?? process.env.VITE_BUILD_NUMBER ?? "dev";
const workspaceRoot = path.resolve(__dirname, "..");
const runtimePackages = [
  "@auth/core",
  "@base-ui/react",
  "@convex-dev/auth",
  "@tanstack/react-form",
  "@tanstack/react-router",
  "class-variance-authority",
  "clsx",
  "convex",
  "lucide-react",
  "radix-ui",
  "react",
  "react-dom",
  "shadcn",
  "tailwind-merge",
  "use-debounce",
  "vaul",
] as const;
const webPackageAliases = Object.fromEntries(
  runtimePackages.map((packageName) => [
    packageName,
    path.resolve(__dirname, "node_modules", packageName),
  ]),
);

export default defineConfig({
  envDir: __dirname,
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_NUMBER__: JSON.stringify(buildNumber),
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: [workspaceRoot],
    },
  },
  publicDir: "../public",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  plugins: [
    tanstackRouter({
      routesDirectory: "../src/ui/web/routes",
      generatedRouteTree: "../src/ui/web/routeTree.gen.ts",
      target: "react",
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@/convex": path.resolve(__dirname, "../convex"),
      "@": path.resolve(__dirname, "../src"),
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
});
