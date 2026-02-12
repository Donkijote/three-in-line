import { fireEvent, render, screen } from "@testing-library/react";

import { playDisconnectedSound } from "@/ui/web/lib/sound";

import { MatchErrorScreen } from "./MatchErrorScreen";

const navigate = vi.fn();
let gameSoundsEnabled = true;

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

vi.mock("@/ui/web/application/providers/UserPreferencesProvider", () => ({
  useUserPreferences: () => ({
    preferences: {
      gameSounds: gameSoundsEnabled,
      haptics: false,
      theme: "system",
    },
    updatePreferences: vi.fn(),
  }),
}));

vi.mock("@/ui/web/lib/sound", () => ({
  playDisconnectedSound: vi.fn(),
}));

describe("MatchErrorScreen", () => {
  beforeEach(() => {
    navigate.mockClear();
    gameSoundsEnabled = true;
    vi.mocked(playDisconnectedSound).mockClear();
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

  it("plays disconnected sound on open when sounds are enabled", () => {
    render(<MatchErrorScreen error={new Error("Game not found")} />);

    expect(playDisconnectedSound).toHaveBeenCalledTimes(1);
  });

  it("does not play disconnected sound when sounds are disabled", () => {
    gameSoundsEnabled = false;
    render(<MatchErrorScreen error={new Error("Game not found")} />);

    expect(playDisconnectedSound).not.toHaveBeenCalled();
  });
});
