import type { Config } from "tailwindcss";

const config = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./**/*.{js,jsx,ts,tsx}",
    "../src/ui/mobile/**/*.{js,jsx,ts,tsx}",
    "../src/ui/shared/**/*.{js,jsx,ts,tsx}"
  ]
} satisfies Config;

export default config;
