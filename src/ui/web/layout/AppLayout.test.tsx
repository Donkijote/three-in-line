import { render, screen } from "@testing-library/react";

import { AppLayout } from "./AppLayout";

describe("AppLayout", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () =>
        ({
          matches: false,
          media: "",
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    });
  });

  it("renders children inside the main container", () => {
    render(
      <AppLayout>
        <div data-testid="layout-child">Content</div>
      </AppLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId("layout-child")).toBeInTheDocument();
    expect(main).toContainElement(screen.getByTestId("layout-child"));
  });
});
