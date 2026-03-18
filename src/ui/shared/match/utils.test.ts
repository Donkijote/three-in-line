import {
  buildMatchPlayers,
  getMatchResultViewModel,
  getOpponentId,
  resolveCurrentSlot,
  toDisplayBoard,
} from "./utils";

describe("match utils", () => {
  it("resolves the current slot from the player one id", () => {
    expect(resolveCurrentSlot("user-1", "user-1")).toBe("P1");
    expect(resolveCurrentSlot("user-2", "user-1")).toBe("P2");
    expect(resolveCurrentSlot(undefined, "user-1")).toBeUndefined();
  });

  it("resolves the opponent id for the active player", () => {
    expect(
      getOpponentId({ p1UserId: "user-1", p2UserId: "user-2" }, "user-1"),
    ).toBe("user-2");
    expect(
      getOpponentId({ p1UserId: "user-1", p2UserId: "user-2" }, "user-2"),
    ).toBe("user-1");
    expect(
      getOpponentId({ p1UserId: "user-1", p2UserId: "user-2" }, undefined),
    ).toBe("user-2");
  });

  it("maps board cells to display symbols", () => {
    expect(
      toDisplayBoard(["P1", "P2", null, null, "P1", null, "P2", null, null], 3),
    ).toEqual([
      ["X", "O", ""],
      ["", "X", ""],
      ["O", "", ""],
    ]);
  });

  it("builds the match players from the current user perspective", () => {
    expect(
      buildMatchPlayers(
        "user-1",
        "P2",
        {
          id: "user-2",
          username: "you",
          avatar: { type: "preset", value: "avatar-2" },
        },
        {
          id: "user-1",
          username: "opponent",
          avatar: { type: "preset", value: "avatar-1" },
        },
        {
          format: "bo3",
          targetWins: 2,
          roundIndex: 2,
          score: { P1: 1, P2: 0 },
          matchWinner: null,
          rounds: [],
        },
      ),
    ).toEqual([
      expect.objectContaining({
        symbol: "O",
        wins: 0,
        isTurn: true,
        accent: "primary",
      }),
      expect.objectContaining({
        symbol: "X",
        wins: 1,
        isTurn: false,
        accent: "opponent",
      }),
    ]);
  });

  it("returns the win model for the winning player", () => {
    expect(
      getMatchResultViewModel({
        status: "ended",
        endedReason: "win",
        winner: "P1",
        abandonedBy: null,
        p1UserId: "user-1",
        currentUserId: "user-1",
        score: { P1: 2, P2: 1 },
        currentUser: { name: "You" },
        opponentUser: { name: "Opponent" },
      }),
    ).toEqual(
      expect.objectContaining({
        title: "You win!",
        icon: "trophy",
        isCurrentWinner: true,
        score: { current: 2, opponent: 1 },
      }),
    );
  });

  it("suppresses the abandoned result when the current user quit", () => {
    expect(
      getMatchResultViewModel({
        status: "ended",
        endedReason: "abandoned",
        winner: "P2",
        abandonedBy: "P1",
        p1UserId: "user-1",
        currentUserId: "user-1",
        score: { P1: 0, P2: 1 },
        currentUser: { name: "You" },
        opponentUser: { name: "Opponent" },
      }),
    ).toBeNull();
  });
});
