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

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_NUMBER__: JSON.stringify(buildNumber),
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    tanstackRouter({
      routesDirectory: "src/ui/web/routes",
      generatedRouteTree: "src/ui/web/routeTree.gen.ts",
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
      "@/convex": path.resolve(__dirname, "./convex"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
