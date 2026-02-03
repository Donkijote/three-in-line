import { vi } from "vitest";

import "@testing-library/jest-dom/vitest";

vi.stubEnv("VITE_CONVEX_URL", "http://localhost:3210");

vi.mock(
  "@/convex/_generated/api",
  () => ({
    api: { users: {}, tasks: {} },
  }),
    // @ts-ignore
  { virtual: true },
);
