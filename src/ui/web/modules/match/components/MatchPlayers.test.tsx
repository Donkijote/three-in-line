import { render } from "@testing-library/react";

import type { UserAvatar } from "@/domain/entities/Avatar";

import { MatchPlayers } from "./MatchPlayers";

const { PlayerCardMock } = vi.hoisted(() => ({
  PlayerCardMock: vi.fn(() => <div data-testid="player-card" />),
}));

vi.mock("@/ui/web/modules/match/components/PlayerCard", () => ({
  PlayerCard: PlayerCardMock,
}));

describe("MatchPlayers", () => {
  beforeEach(() => {
    PlayerCardMock.mockClear();
  });

  it("builds player cards for the current user as P1", () => {
    const game = {
      p1UserId: "user-1",
      p2UserId: "user-2",
      currentTurn: "P1" as const,
    };
    const currentUser = {
      id: "user-1",
      username: "nova",
      avatar: {
        type: "preset",
        value: "avatar-1",
      } as UserAvatar,
    };
    const opponentUser = {
      id: "user-2",
      name: "Rex",
      avatar: {
        type: "generated",
        value: "seed",
      } as UserAvatar,
    };

    const { container } = render(
      <MatchPlayers
        game={game}
        currentUser={currentUser}
        opponentUser={opponentUser}
        layout="desktop"
      />,
    );

    expect(container.firstChild).toHaveClass("grid", "gap-6");
    expect(PlayerCardMock).toHaveBeenCalledTimes(2);

    const [currentPlayerProps] = PlayerCardMock.mock.calls[0];
    const [opponentPlayerProps] = PlayerCardMock.mock.calls[1];

    expect(currentPlayerProps).toMatchObject({
      id: "player-me",
      name: "nova",
      symbol: "X",
      wins: 0,
      isTurn: true,
      accent: "primary",
      avatar: "/avatars/avatar-1.svg",
    });

    expect(opponentPlayerProps).toMatchObject({
      id: "player-opponent",
      name: "Rex",
      symbol: "O",
      wins: 0,
      isTurn: false,
      accent: "opponent",
      avatar: "seed",
    });
  });

  it("swaps symbols when the current user is P2 and uses mobile layout", () => {
    const game = {
      p1UserId: "user-1",
      p2UserId: "user-2",
      currentTurn: "P2" as const,
    };
    const currentUser = {
      id: "user-2",
      name: "Alex",
    };
    const opponentUser = {
      id: "user-1",
      name: "Riley",
    };

    const { container } = render(
      <MatchPlayers
        game={game}
        currentUser={currentUser}
        opponentUser={opponentUser}
        layout="mobile"
      />,
    );

    expect(container.firstChild).toHaveClass("grid", "grid-cols-2", "gap-6");
    expect(PlayerCardMock).toHaveBeenCalledTimes(2);

    const [currentPlayerProps] = PlayerCardMock.mock.calls[0];
    const [opponentPlayerProps] = PlayerCardMock.mock.calls[1];

    expect(currentPlayerProps).toMatchObject({
      name: "Alex",
      symbol: "O",
      isTurn: true,
    });
    expect(opponentPlayerProps).toMatchObject({
      name: "Riley",
      symbol: "X",
      isTurn: false,
    });
  });
});
