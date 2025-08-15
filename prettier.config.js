export default {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindStylesheet: "./src/App.css",
  importOrderSeparation: true,
  importOrder: ["^@react/(.*)$", "^@/(.*)$", "^@(.*)$", "^[.*]", "^[./]"],
};
