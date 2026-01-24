import { render, screen } from "@testing-library/react";

import { AppLayout } from "./AppLayout";

const { useConvexAuthMock } = vi.hoisted(() => ({
  useConvexAuthMock: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useConvexAuth: useConvexAuthMock,
}));

vi.mock("@/ui/web/layout/components/NavBar", () => ({
  NavBar: () => <div data-testid="nav-bar" />,
}));

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
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
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

  it("adds bottom padding when authenticated", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    expect(container.querySelector("main")).toHaveClass("pb-24");
  });
});
