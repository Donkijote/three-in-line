import { fireEvent, render, screen } from "@testing-library/react";

import type { UserAvatar } from "@/domain/entities/Avatar";

import { MatchResultOverlay } from "./MatchResultOverlay";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

describe("MatchResultOverlay", () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <MatchResultOverlay
        isOpen={false}
        result="win"
        isWinner={true}
        currentUser={{ name: "Nova" }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders winner state and navigates on actions", () => {
    render(
      <MatchResultOverlay
        isOpen={true}
        result="win"
        isWinner={true}
        currentUser={{ name: "Nova" }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(screen.getByText("You win!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /play again/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to home/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
    fireEvent.click(screen.getByRole("button", { name: /back to home/i }));

    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenLastCalledWith({ to: "/play" });
  });

  it("renders defeat state labels", () => {
    render(
      <MatchResultOverlay
        isOpen={true}
        result="win"
        isWinner={false}
        currentUser={{
          name: "Nova",
          avatar: { type: "preset", value: "avatar-1" } as UserAvatar,
        }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(screen.getByText("Defeat")).toBeInTheDocument();
    expect(screen.getByText(/Don't give up!/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /rematch/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /exit/i })).toBeInTheDocument();
  });

  it("renders disconnect messaging when opponent leaves", () => {
    render(
      <MatchResultOverlay
        isOpen={true}
        result="disconnect"
        isWinner={true}
        currentUser={{ name: "Nova" }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(screen.getByText("Match Ended")).toBeInTheDocument();
    expect(screen.getByText(/opponent has left/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /find new match/i }),
    ).toBeInTheDocument();
  });
});
