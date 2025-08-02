import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vite.setup-tests.ts"],
    include: ["./src/**/*.test.ts", "./src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["./src/main.tsx", "./*.config.*", "./*.d.*"],
    },
  },
} as UserConfig);
