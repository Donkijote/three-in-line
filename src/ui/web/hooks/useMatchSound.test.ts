import { renderHook } from "@testing-library/react";

import type { Game, GameId } from "@/domain/entities/Game";
import {
  playPlayerMarkSound,
  playTimesUpSound,
  startTimerTickSound,
  stopTimerTickSound,
} from "@/ui/web/lib/sound";

import { useMatchSound } from "./useMatchSound";

vi.mock("@/ui/web/lib/sound", () => ({
  playPlayerMarkSound: vi.fn(),
  startTimerTickSound: vi.fn(),
  stopTimerTickSound: vi.fn(),
  playTimesUpSound: vi.fn(),
}));

type Params = {
  gameId: GameId;
  lastMove: Game["lastMove"] | undefined;
  currentSlot: "P1" | "P2" | null;
  isGameReady: boolean;
  isMoveSoundEnabled: boolean;
  soundEnabled: boolean;
  isTimedMode: boolean;
  isOwnTurnTimerActive: boolean;
  isTimeUpVisible: boolean;
  deadlineTime: number | null | undefined;
};

const baseParams: Params = {
  gameId: "game-1" as GameId,
  lastMove: null,
  currentSlot: "P1",
  isGameReady: true,
  isMoveSoundEnabled: true,
  soundEnabled: true,
  isTimedMode: true,
  isOwnTurnTimerActive: true,
  isTimeUpVisible: false,
  deadlineTime: 1_000,
};

describe("useMatchSound", () => {
  beforeEach(() => {
    vi.mocked(playPlayerMarkSound).mockClear();
    vi.mocked(startTimerTickSound).mockClear();
    vi.mocked(stopTimerTickSound).mockClear();
    vi.mocked(playTimesUpSound).mockClear();
  });

  it("does not play move sounds when game is not ready", () => {
    renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        isGameReady: false,
        lastMove: { index: 3, by: "P2", at: 100 },
      },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not play move sound on first ready snapshot with existing last move", () => {
    renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        lastMove: { index: 3, by: "P2", at: 100 },
      },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not play move sounds when move sound is disabled", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        isMoveSoundEnabled: false,
      },
    });

    rerender({
      ...baseParams,
      isMoveSoundEnabled: false,
      lastMove: { index: 3, by: "P2", at: 100 },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("plays opponent move sounds with mapped symbols", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        lastMove: null,
        currentSlot: "P1",
      },
    });

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

  it("does not play when the last move is from the current slot", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        lastMove: null,
        currentSlot: "P1",
      },
    });

    rerender({
      ...baseParams,
      currentSlot: "P1",
      lastMove: { index: 5, by: "P1", at: 101 },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("resets move tracking for a different game id", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        gameId: "game-1" as GameId,
        lastMove: { index: 0, by: "P2", at: 10 },
      },
    });

    rerender({
      ...baseParams,
      gameId: "game-2" as GameId,
      lastMove: { index: 1, by: "P2", at: 20 },
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("returns early when initialized and no last move is available", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        currentSlot: "P1",
        lastMove: null,
      },
    });

    rerender({
      ...baseParams,
      currentSlot: "P2",
      lastMove: null,
    });

    expect(playPlayerMarkSound).not.toHaveBeenCalled();
  });

  it("does not replay the same move key", () => {
    const move = { index: 3, by: "P2" as const, at: 100 };
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        currentSlot: "P1",
        lastMove: null,
      },
    });

    rerender({
      ...baseParams,
      currentSlot: "P1",
      lastMove: move,
    });
    expect(playPlayerMarkSound).toHaveBeenCalledTimes(1);

    rerender({
      ...baseParams,
      currentSlot: "P2",
      lastMove: move,
    });

    expect(playPlayerMarkSound).toHaveBeenCalledTimes(1);
  });

  it("starts timer ticking while own timed turn is active", () => {
    renderHook((props: Params) => useMatchSound(props), {
      initialProps: baseParams,
    });

    expect(startTimerTickSound).toHaveBeenCalledTimes(1);
  });

  it("stops timer ticking when ticking conditions are not met", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: baseParams,
    });
    vi.mocked(stopTimerTickSound).mockClear();

    rerender({
      ...baseParams,
      isOwnTurnTimerActive: false,
    });

    expect(stopTimerTickSound).toHaveBeenCalled();
  });

  it("plays times up only once for the same game/deadline key", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: baseParams,
    });

    rerender({
      ...baseParams,
      isTimeUpVisible: true,
      deadlineTime: 1234,
    });
    rerender({
      ...baseParams,
      soundEnabled: false,
      isTimeUpVisible: true,
      deadlineTime: 1234,
    });
    rerender({
      ...baseParams,
      isTimeUpVisible: true,
      deadlineTime: 1234,
    });

    expect(playTimesUpSound).toHaveBeenCalledTimes(1);
  });

  it("plays times up again for a different game", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        isTimeUpVisible: true,
        deadlineTime: 1234,
      },
    });
    vi.mocked(playTimesUpSound).mockClear();

    rerender({
      ...baseParams,
      gameId: "game-2" as GameId,
      isTimeUpVisible: true,
      deadlineTime: 1234,
    });

    expect(playTimesUpSound).toHaveBeenCalledTimes(1);
  });

  it("does not play timer sounds when sound is disabled", () => {
    renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        soundEnabled: false,
        isTimeUpVisible: true,
      },
    });

    expect(startTimerTickSound).not.toHaveBeenCalled();
    expect(playTimesUpSound).not.toHaveBeenCalled();
    expect(stopTimerTickSound).toHaveBeenCalled();
  });
});
