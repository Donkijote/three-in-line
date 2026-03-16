import "@testing-library/jest-dom/vitest";
import { format } from "node:util";

vi.stubEnv("VITE_CONVEX_URL", "http://localhost:3210");

vi.mock(
  "@/convex/_generated/api",
  () => ({
    api: { users: {}, tasks: {} },
  }),
    // @ts-ignore
  { virtual: true },
);

const failOnUnexpectedConsole = (
  method: "error" | "warn",
  args: unknown[],
) => {
  throw new Error(`Unexpected console.${method}: ${format(...args)}`);
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation((...args: Parameters<typeof console.error>) => {
    failOnUnexpectedConsole("error", args);
  });
  vi.spyOn(console, "warn").mockImplementation((...args: Parameters<typeof console.warn>) => {
    failOnUnexpectedConsole("warn", args);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
