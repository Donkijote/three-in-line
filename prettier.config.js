export default {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrderSeparation: true,
  importOrder: ["^@react/(.*)$", "^@/(.*)$", "^@(.*)$", "^[.*]", "^[./]"],
};
