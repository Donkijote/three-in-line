import { render, screen } from "@testing-library/react";

import { MatchActions } from "./MatchActions";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

beforeEach(() => {
  navigate.mockClear();
});

describe("MatchActions", () => {
  it("renders action buttons and round info", () => {
    render(<MatchActions gameId="game-123" />);

    expect(screen.getByText("Reset Round")).toBeInTheDocument();
    expect(screen.getByText("Abandon Match")).toBeInTheDocument();
    expect(screen.getByText("Round 6")).toBeInTheDocument();
    expect(screen.getByText("Best of 10")).toBeInTheDocument();
  });

  it("renders HUD variant without errors", () => {
    render(<MatchActions gameId="game-456" variant="hud" />);

    expect(screen.getByText("Reset Round")).toBeInTheDocument();
  });
});
