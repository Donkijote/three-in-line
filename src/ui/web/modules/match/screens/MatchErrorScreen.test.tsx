import { fireEvent, render, screen } from "@testing-library/react";

import { MatchErrorScreen } from "./MatchErrorScreen";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

describe("MatchErrorScreen", () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it("shows a specific message when the game is missing", () => {
    render(<MatchErrorScreen error={new Error("Game not found")} />);

    expect(
      screen.getByText(
        "Your opponent abandoned the game. You'll return to the lobby.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a fallback message for other errors", () => {
    render(<MatchErrorScreen error={new Error("Something else")} />);

    expect(
      screen.getByText(
        "This match is no longer available. You'll return to the lobby.",
      ),
    ).toBeInTheDocument();
  });

  it("navigates back to the lobby on confirmation", () => {
    render(<MatchErrorScreen error={new Error("Game not found")} />);

    fireEvent.click(screen.getByRole("button", { name: "Ok" }));

    expect(navigate).toHaveBeenCalledWith({ to: "/play" });
  });
});
