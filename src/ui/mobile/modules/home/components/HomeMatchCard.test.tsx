import { renderMobile } from "@/test/mobile/render";

import { HomeMatchCard } from "./HomeMatchCard";

const mockUseHomeMatchCard = jest.fn();

jest.mock("@/ui/shared/home/hooks/useHomeMatchCard", () => ({
  useHomeMatchCard: (opponentUserId: string) =>
    mockUseHomeMatchCard(opponentUserId),
}));

describe("HomeMatchCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHomeMatchCard.mockReturnValue({
      currentAvatar: "/avatars/avatar-1.svg",
      currentInitials: "JD",
      currentName: "Jane",
      opponentAvatar: "/avatars/avatar-2.svg",
      opponentInitials: "OP",
      opponentName: "Orion",
    });
  });

  it("renders match status, metadata, and player identities", () => {
    const screen = renderMobile(
      <HomeMatchCard
        opponentUserId="opponent-1"
        status="victory"
        subtitle="Fast win"
        time="2h ago"
      />,
    );

    expect(mockUseHomeMatchCard).toHaveBeenCalledWith("opponent-1");
    expect(screen.getByText("Victory")).toBeTruthy();
    expect(screen.getByText("2h ago")).toBeTruthy();
    expect(screen.getByText("vs Orion")).toBeTruthy();
    expect(screen.getByText("Fast win")).toBeTruthy();
    expect(screen.getByText("JD")).toBeTruthy();
    expect(screen.getByText("OP")).toBeTruthy();
  });

  it("falls back to initials when either player avatar is missing", () => {
    mockUseHomeMatchCard.mockReturnValue({
      currentAvatar: null,
      currentInitials: "JD",
      currentName: "Jane",
      opponentAvatar: null,
      opponentInitials: "OP",
      opponentName: "Orion",
    });

    const screen = renderMobile(
      <HomeMatchCard
        opponentUserId="opponent-1"
        status="defeat"
        subtitle="Close loss"
        time="Yesterday"
      />,
    );

    expect(screen.getByText("Defeat")).toBeTruthy();
    expect(screen.getByText("JD")).toBeTruthy();
    expect(screen.getByText("OP")).toBeTruthy();
  });
});
