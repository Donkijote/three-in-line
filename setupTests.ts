import { vi } from "vitest";

import "@testing-library/jest-dom/vitest";

vi.mock(
  "@/convex/_generated/api",
  () => ({
    api: { users: {}, tasks: {} },
  }),
    // @ts-ignore
  { virtual: true },
);
