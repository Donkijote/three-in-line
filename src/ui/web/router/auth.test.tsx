import { vi } from "vitest";

import { render, screen } from "@testing-library/react";

const {
  useConvexAuthMock,
  AuthenticatedMock,
  UnauthenticatedMock,
  NavigateMock,
} = vi.hoisted(() => ({
  useConvexAuthMock: vi.fn(),
  AuthenticatedMock: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="authenticated">{children}</div>
  ),
  UnauthenticatedMock: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="unauthenticated">{children}</div>
  ),
  NavigateMock: vi.fn(({ to }: { replace: boolean; to: string }) => (
    <div data-testid="navigate" data-to={to} />
  )),
}));

vi.mock("convex/react", () => ({
  Authenticated: AuthenticatedMock,
  Unauthenticated: UnauthenticatedMock,
  useConvexAuth: useConvexAuthMock,
}));

vi.mock("@tanstack/react-router", () => ({
  Navigate: NavigateMock,
}));

import { RequireAuth, RequireUnAuth } from "./auth";

describe("auth guards", () => {
  beforeEach(() => {
    useConvexAuthMock.mockReset();
  });

  it("renders a loader while checking auth for RequireAuth", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <RequireAuth>
        <div>Child</div>
      </RequireAuth>,
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("redirects to login when unauthenticated", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <RequireAuth>
        <div>Child</div>
      </RequireAuth>,
    );

    const [props] = NavigateMock.mock.calls[0];
    expect(props.to).toBe("/login");
    expect(props.replace).toBe(true);
  });

  it("renders children for authenticated users", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <RequireAuth>
        <div data-testid="child">Child</div>
      </RequireAuth>,
    );

    expect(screen.getByTestId("authenticated")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders a loader while checking auth for RequireUnAuth", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <RequireUnAuth>
        <div>Child</div>
      </RequireUnAuth>,
    );

    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
  });

  it("redirects to home when authenticated", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <RequireUnAuth>
        <div>Child</div>
      </RequireUnAuth>,
    );

    const [props] = NavigateMock.mock.calls[0];
    expect(props.to).toBe("/");
    expect(props.replace).toBe(true);
  });

  it("renders children for unauthenticated users", () => {
    useConvexAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <RequireUnAuth>
        <div data-testid="child">Child</div>
      </RequireUnAuth>,
    );

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
