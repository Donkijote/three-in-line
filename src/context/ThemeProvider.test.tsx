import { afterAll } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { ThemeProvider, useTheme } from "./ThemeProvider";

const Button = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className={`btn-${theme}`}>
      Toggle Theme
    </button>
  );
};

describe("Theme Provider", () => {
  afterAll(() => {
    localStorage.removeItem("theme");
  });
  test("should toggle theme between light and dark", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));

    render(
      <ThemeProvider>
        <div data-testid={"theme-container"}>
          <Button />
          <p>some child</p>
        </div>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme-container")).toBeInTheDocument();
    const button = screen.getByText("Toggle Theme");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn-light");

    fireEvent.click(button);

    expect(button).toHaveClass("btn-dark");
  });
  test("should toggle theme between dark and light", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: true }));

    render(
      <ThemeProvider>
        <div data-testid={"theme-container"}>
          <Button />
          <p>some child</p>
        </div>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme-container")).toBeInTheDocument();
    const button = screen.getByText("Toggle Theme");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn-dark");

    fireEvent.click(button);

    expect(button).toHaveClass("btn-light");
  });
});
