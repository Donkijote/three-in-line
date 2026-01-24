import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";

import { MatchActions } from "./MatchActions";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    ...props
  }: {
    children: ReactNode;
    to: string;
  }) => <a {...props}>{children}</a>,
}));

describe("MatchActions", () => {
  it("renders action buttons and round info", () => {
    render(<MatchActions />);

    expect(screen.getByText("Reset Round")).toBeInTheDocument();
    expect(screen.getByText("Abandon Match")).toBeInTheDocument();
    expect(screen.getByText("Round 6")).toBeInTheDocument();
    expect(screen.getByText("Best of 10")).toBeInTheDocument();
  });

  it("renders HUD variant without errors", () => {
    render(<MatchActions variant="hud" />);

    expect(screen.getByText("Reset Round")).toBeInTheDocument();
  });
});
