import { beforeAll } from "vitest";

import { ThemeProvider } from "@/context/ThemeProvider";

import { fireEvent, render, screen } from "@testing-library/react";

import { Layout } from "./Layout";

describe("Layout", () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
  });
  test("renders Navbar and Sidebar components and toggle sidebar", () => {
    render(
      <ThemeProvider>
        <Layout />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();

    const toggleButton = screen.getByTestId("toggle-sidebar");
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByTestId("sidebar")).toHaveClass("translate-x-0");
  });
});
