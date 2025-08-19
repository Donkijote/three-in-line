import { beforeAll } from "vitest";

import { ThemeProvider } from "@/context/ThemeProvider.tsx";

import { render, screen } from "@testing-library/react";

import { Layout } from "./Layout";

describe("Layout", () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
  });
  test("renders Navbar and Sidebar components", () => {
    render(
      <ThemeProvider>
        <Layout />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});
