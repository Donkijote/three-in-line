import { Text } from "react-native";

import { renderMobile } from "@/test/mobile/render";

import { RequireAuth, RequireUnAuth } from "./auth";

const mockUseConvexAuth = jest.fn();

jest.mock("@/infrastructure/convex/auth", () => {
  const React = require("react") as typeof import("react");

  return {
    Authenticated: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    Unauthenticated: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useConvexAuth: () => mockUseConvexAuth(),
  };
});

describe("mobile auth guards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a loader while authentication state is pending", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const screen = renderMobile(
      <RequireAuth>
        <Text>private</Text>
      </RequireAuth>,
    );

    expect(screen.getByText("Loading session...")).toBeTruthy();
    expect(screen.queryByText("private")).toBeNull();
  });

  it("redirects unauthenticated users away from protected routes", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const screen = renderMobile(
      <RequireAuth>
        <Text>private</Text>
      </RequireAuth>,
    );

    expect(screen.getByTestId("redirect")).toBeTruthy();
  });

  it("renders authenticated content when the session is active", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const screen = renderMobile(
      <RequireAuth>
        <Text>private</Text>
      </RequireAuth>,
    );

    expect(screen.getByText("private")).toBeTruthy();
  });

  it("redirects authenticated users away from unauthenticated routes", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const screen = renderMobile(
      <RequireUnAuth>
        <Text>public</Text>
      </RequireUnAuth>,
    );

    expect(screen.getByTestId("redirect")).toBeTruthy();
  });

  it("renders unauthenticated content when the user is signed out", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const screen = renderMobile(
      <RequireUnAuth>
        <Text>public</Text>
      </RequireUnAuth>,
    );

    expect(screen.getByText("public")).toBeTruthy();
  });
});
