import { beforeAll } from "vitest";

import { render, screen } from "@testing-library/react";

import App from "./App.tsx";

describe("App Test", () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
  });
  test("Render App", () => {
    render(<App />);
    expect(screen.getByTestId("app")).toBeInTheDocument();
  });
});
