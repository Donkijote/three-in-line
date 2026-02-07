import { renderHook } from "@testing-library/react";

import type { Game, GameId } from "@/domain/entities/Game";
import { playPlayerMarkSound } from "@/ui/web/lib/sound";

import { useMatchMoveSound } from "./useMatchMoveSound";

vi.mock("@/ui/web/lib/sound", () => ({
  playPlayerMarkSound: vi.fn(),
}));

type Params = {
  gameId: GameId;
  lastMove: Game["lastMove"] | undefined;
  currentSlot: "P1" | "P2" | null;
  isGameReady: boolean;
  isMoveSoundEnabled: boolean;
};

const baseParams: Params = {
  gameId: "game-1" as GameId,
  lastMove: null,
  currentSlot: "P1",
  isGameReady: true,
  isMoveSoundEnabled: true,
};

describe("useMatchMoveSound", () => {
  beforeEach(() => {
    vi.mocked(playPlayerMarkSound).mockClear();
  });

  it("does not play when game is not ready", () => {
    renderHook((props: Params) => useMatchMoveSound(props), {
      initialProps: {
        ...baseParams,
        isGameReady: false,
        lastMove: { index: 3, by: "P2", at: 100 },
      },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not play on first ready snapshot with existing last move", () => {
    renderHook((props: Params) => useMatchMoveSound(props), {
      initialProps: {
        ...baseParams,
        lastMove: { index: 3, by: "P2", at: 100 },
      },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not play when move sounds are disabled", () => {
    const { rerender } = renderHook(
      (props: Params) => useMatchMoveSound(props),
      {
        initialProps: {
          ...baseParams,
          isMoveSoundEnabled: false,
          lastMove: null,
        },
      },
    );

    rerender({
      ...baseParams,
      isMoveSoundEnabled: false,
      lastMove: { index: 3, by: "P2", at: 100 },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("returns early when initialized and still no last move", () => {
    const { rerender } = renderHook(
      (props: Params) => useMatchMoveSound(props),
      {
        initialProps: {
          ...baseParams,
          lastMove: null,
        },
      },
    );

    rerender({
      ...baseParams,
      currentSlot: "P2",
      lastMove: null,
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not replay for the same move key", () => {
    const move = { index: 3, by: "P2" as const, at: 100 };
    const { rerender } = renderHook(
      (props: Params) => useMatchMoveSound(props),
      {
        initialProps: {
          ...baseParams,
          lastMove: move,
        },
      },
    );

    rerender({
      ...baseParams,
      currentSlot: "P2",
      lastMove: move,
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not play when the move is from the current slot", () => {
    const { rerender } = renderHook(
      (props: Params) => useMatchMoveSound(props),
      {
        initialProps: {
          ...baseParams,
          lastMove: null,
          currentSlot: "P1",
        },
      },
    );

    rerender({
      ...baseParams,
      currentSlot: "P1",
      lastMove: { index: 5, by: "P1", at: 101 },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("plays opponent move sounds with mapped symbols", () => {
    const { rerender } = renderHook(
      (props: Params) => useMatchMoveSound(props),
      {
        initialProps: {
          ...baseParams,
          lastMove: null,
          currentSlot: "P1",
        },
      },
    );

    rerender({
      ...baseParams,
      currentSlot: "P1",
      lastMove: { index: 2, by: "P2", at: 200 },
    });

    rerender({
      ...baseParams,
      currentSlot: "P2",
      lastMove: { index: 1, by: "P1", at: 201 },
    });

    expect(playPlayerMarkSound).toHaveBeenNthCalledWith(1, "O");
    expect(playPlayerMarkSound).toHaveBeenNthCalledWith(2, "X");
  });

  it("resets per game id and does not play initial move of a new game", () => {
    const { rerender } = renderHook(
      (props: Params) => useMatchMoveSound(props),
      {
        initialProps: {
          ...baseParams,
          gameId: "game-1" as GameId,
          lastMove: { index: 0, by: "P2", at: 10 },
        },
      },
    );

    rerender({
      ...baseParams,
      gameId: "game-2" as GameId,
      lastMove: { index: 1, by: "P2", at: 20 },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });
});
