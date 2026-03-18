import type { ComponentProps } from "react";

import type { UserAvatar } from "@/domain/entities/Avatar";
import type { MatchState } from "@/domain/entities/Game";
import { renderMobile } from "@/test/mobile/render";

import { MatchPlayers } from "./MatchPlayers";
import type { PlayerCard } from "./PlayerCard";

type PlayerCardProps = ComponentProps<typeof PlayerCard>;

const mockPlayerCard = jest.fn((_: PlayerCardProps) => null);

jest.mock("./PlayerCard", () => ({
  PlayerCard: (props: PlayerCardProps) => mockPlayerCard(props),
}));

describe("MatchPlayers", () => {
  beforeEach(() => {
    mockPlayerCard.mockClear();
  });

  it("builds player cards for the current user as P1", () => {
    const match: MatchState = {
      format: "bo3",
      targetWins: 2,
      roundIndex: 2,
      score: { P1: 1, P2: 0 },
      matchWinner: null,
      rounds: [],
    };

    renderMobile(
      <MatchPlayers
        p1UserId="user-1"
        currentTurn="P1"
        timerActive={false}
        timerProgress={0}
        currentUser={{
          id: "user-1",
          username: "nova",
          avatar: { type: "preset", value: "avatar-1" } as UserAvatar,
        }}
        opponentUser={{
          id: "user-2",
          name: "Rex",
          avatar: { type: "generated", value: "seed" } as UserAvatar,
        }}
        match={match}
      />,
    );

    expect(mockPlayerCard).toHaveBeenCalledTimes(2);

    const currentPlayerProps = mockPlayerCard.mock.calls[0]?.[0];
    const opponentPlayerProps = mockPlayerCard.mock.calls[1]?.[0];

    expect(currentPlayerProps).toMatchObject({
      name: "nova",
      symbol: "X",
      wins: 1,
      isTurn: true,
      accent: "primary",
      avatar: "/avatars/avatar-1.svg",
      showWins: true,
    });

    expect(opponentPlayerProps).toMatchObject({
      name: "Rex",
      symbol: "O",
      wins: 0,
      isTurn: false,
      accent: "opponent",
      avatar: "seed",
      showWins: true,
    });
  });

  it("swaps symbols and injects timer props when the current user is P2", () => {
    const match: MatchState = {
      format: "bo5",
      targetWins: 3,
      roundIndex: 3,
      score: { P1: 2, P2: 1 },
      matchWinner: null,
      rounds: [],
    };

    renderMobile(
      <MatchPlayers
        p1UserId="user-1"
        currentTurn="P2"
        timerActive
        timerProgress={0.4}
        currentUser={{ id: "user-2", name: "Alex" }}
        opponentUser={{ id: "user-1", name: "Riley" }}
        match={match}
      />,
    );

    const currentPlayerProps = mockPlayerCard.mock.calls[0]?.[0];
    const opponentPlayerProps = mockPlayerCard.mock.calls[1]?.[0];

    expect(currentPlayerProps).toMatchObject({
      name: "Alex",
      symbol: "O",
      wins: 1,
      isTurn: true,
      turnTimer: { isActive: true, progress: 0.4 },
    });

    expect(opponentPlayerProps).toMatchObject({
      name: "Riley",
      symbol: "X",
      wins: 2,
      isTurn: false,
      turnTimer: undefined,
    });
  });
});
