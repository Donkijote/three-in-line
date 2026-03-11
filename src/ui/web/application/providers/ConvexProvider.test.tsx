import { render, screen } from "@testing-library/react";

const { mockConvexAuthProvider, mockConvexClient } = vi.hoisted(() => ({
  mockConvexAuthProvider: vi.fn(({ children }) => (
    <div data-testid="convex-provider">{children}</div>
  )),
  mockConvexClient: { id: "mock-client" },
}));

vi.mock("@convex-dev/auth/react", () => ({
  ConvexAuthProvider: mockConvexAuthProvider,
}));

vi.mock("@/infrastructure/convex/client", () => ({
  initConvexClient: vi.fn(() => mockConvexClient),
}));

import { ConvexProvider } from "./ConvexProvider";

describe("ConvexProvider", () => {
  it("renders children through ConvexAuthProvider", () => {
    render(
      <ConvexProvider>
        <span data-testid="child">Child</span>
      </ConvexProvider>,
    );

    expect(screen.getByTestId("convex-provider")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("passes the convex client to ConvexAuthProvider", () => {
    render(
      <ConvexProvider>
        <span>Child</span>
      </ConvexProvider>,
    );

    const [props] = mockConvexAuthProvider.mock.calls[0];
    expect(props.client).toEqual(mockConvexClient);
  });
});
