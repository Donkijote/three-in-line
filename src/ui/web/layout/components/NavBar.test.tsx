import { render, screen } from "@testing-library/react";

const { useConvexAuthMock, useRouterStateMock, LinkMock } = vi.hoisted(() => ({
  useConvexAuthMock: vi.fn(),
  useRouterStateMock: vi.fn(),
  LinkMock: ({ to, children }: { to: string; children: ReactNode }) => (
    <a data-testid={`link-${to}`} href={to}>
      {children}
    </a>
  ),
}));

vi.mock("convex/react", () => ({
  useConvexAuth: useConvexAuthMock,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: LinkMock,
  useRouterState: useRouterStateMock,
}));

import type { ReactNode } from "react";

import { NavBar } from "./NavBar";

describe("NavBar", () => {
  beforeEach(() => {
    useConvexAuthMock.mockReset();
    useRouterStateMock.mockReset();
  });

  it("renders nothing while auth is loading", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });
    useRouterStateMock.mockReturnValue({ location: { pathname: "/" } });

    const { container } = render(<NavBar />);

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when unauthenticated", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    useRouterStateMock.mockReturnValue({ location: { pathname: "/" } });

    const { container } = render(<NavBar />);

    expect(container.firstChild).toBeNull();
  });

  it("renders links when authenticated", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    useRouterStateMock.mockReturnValue({ location: { pathname: "/" } });

    render(<NavBar />);

    expect(screen.getByTestId("link-/")).toBeInTheDocument();
    expect(screen.getByTestId("link-/play")).toBeInTheDocument();
    expect(screen.getByTestId("link-/settings")).toBeInTheDocument();
  });

  it("marks the active link based on pathname", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    useRouterStateMock.mockImplementation(({ select }) =>
      select({ location: { pathname: "/play" } }),
    );

    render(<NavBar />);

    expect(screen.getByText("Play")).toHaveClass("text-primary");
    expect(screen.getByText("Home")).toHaveClass("text-muted-foreground");
  });
});
