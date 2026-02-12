import { renderHook } from "@testing-library/react";

import type { Game, GameId } from "@/domain/entities/Game";
import {
  playAbandonedWinHaptic,
  playDefeatOverlayHaptic,
  playOpponentDisconnectedHaptic,
  playOpponentReconnectedHaptic,
  playTimeStoppedHaptic,
  playVictoryOverlayHaptic,
} from "@/ui/web/lib/haptics";
import {
  playDefeatSound,
  playConnectedSound,
  playDisconnectedSound,
  playPlayerMarkSound,
  playSurrenderSound,
  playTimesUpSound,
  playVictorySound,
  startTimerTickSound,
  stopResultSound,
  stopTimerTickSound,
} from "@/ui/web/lib/sound";

import { useMatchResultOverlaySound, useMatchSound } from "./useMatchSound";

vi.mock("@/ui/web/lib/sound", () => ({
  playDefeatSound: vi.fn(),
  playConnectedSound: vi.fn(),
  playDisconnectedSound: vi.fn(),
  playPlayerMarkSound: vi.fn(),
  playSurrenderSound: vi.fn(),
  startTimerTickSound: vi.fn(),
  stopTimerTickSound: vi.fn(),
  playTimesUpSound: vi.fn(),
  playVictorySound: vi.fn(),
  stopResultSound: vi.fn(),
}));
vi.mock("@/ui/web/lib/haptics", () => ({
  playAbandonedWinHaptic: vi.fn(),
  playDefeatOverlayHaptic: vi.fn(),
  playOpponentDisconnectedHaptic: vi.fn(),
  playOpponentReconnectedHaptic: vi.fn(),
  playTimeStoppedHaptic: vi.fn(),
  playVictoryOverlayHaptic: vi.fn(),
}));

type Params = {
  gameId: GameId;
  status: Game["status"] | undefined;
  lastMove: Game["lastMove"] | undefined;
  currentSlot: "P1" | "P2" | null;
  isGameReady: boolean;
  isMoveSoundEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  isTimedMode: boolean;
  isOwnTurnTimerActive: boolean;
  isTimeUpVisible: boolean;
  deadlineTime: number | null | undefined;
};

const baseParams: Params = {
  gameId: "game-1" as GameId,
  status: "playing",
  lastMove: null,
  currentSlot: "P1",
  isGameReady: true,
  isMoveSoundEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  isTimedMode: true,
  isOwnTurnTimerActive: true,
  isTimeUpVisible: false,
  deadlineTime: 1_000,
};

describe("useMatchSound", () => {
  beforeEach(() => {
    vi.mocked(playConnectedSound).mockClear();
    vi.mocked(playDisconnectedSound).mockClear();
    vi.mocked(playOpponentDisconnectedHaptic).mockClear();
    vi.mocked(playOpponentReconnectedHaptic).mockClear();
    vi.mocked(playTimeStoppedHaptic).mockClear();
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
    expect(playTimeStoppedHaptic).toHaveBeenCalledTimes(1);
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
    expect(playTimeStoppedHaptic).toHaveBeenCalledTimes(1);
    expect(stopTimerTickSound).toHaveBeenCalled();
  });

  it("does not play time stopped haptic when haptics are disabled", () => {
    renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        soundEnabled: true,
        hapticsEnabled: false,
        isTimeUpVisible: true,
      },
    });

    expect(playTimesUpSound).toHaveBeenCalledTimes(1);
    expect(playTimeStoppedHaptic).not.toHaveBeenCalled();
  });

  it("plays disconnected sound when match transitions from playing to paused", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        status: "playing",
      },
    });

    rerender({
      ...baseParams,
      status: "paused",
    });

    expect(playDisconnectedSound).toHaveBeenCalledTimes(1);
    expect(playOpponentDisconnectedHaptic).toHaveBeenCalledTimes(1);
    expect(playConnectedSound).not.toHaveBeenCalled();
  });

  it("plays connected sound when match transitions from paused to playing", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        status: "paused",
      },
    });

    rerender({
      ...baseParams,
      status: "playing",
    });

    expect(playConnectedSound).toHaveBeenCalledTimes(1);
    expect(playDisconnectedSound).not.toHaveBeenCalled();
    expect(playOpponentReconnectedHaptic).toHaveBeenCalledTimes(1);
  });

  it("does not play connection sounds on initial paused snapshot", () => {
    renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        status: "paused",
      },
    });

    expect(playConnectedSound).not.toHaveBeenCalled();
    expect(playDisconnectedSound).not.toHaveBeenCalled();
  });

  it("does not play connection sounds when sounds are disabled", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        soundEnabled: false,
        hapticsEnabled: false,
        status: "playing",
      },
    });

    rerender({
      ...baseParams,
      soundEnabled: false,
      hapticsEnabled: false,
      status: "paused",
    });

    expect(playConnectedSound).not.toHaveBeenCalled();
    expect(playDisconnectedSound).not.toHaveBeenCalled();
    expect(playOpponentDisconnectedHaptic).not.toHaveBeenCalled();
    expect(playOpponentReconnectedHaptic).not.toHaveBeenCalled();
  });

  it("plays disconnected haptic when sounds are disabled but haptics are enabled", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        soundEnabled: false,
        hapticsEnabled: true,
        status: "playing",
      },
    });

    rerender({
      ...baseParams,
      soundEnabled: false,
      hapticsEnabled: true,
      status: "paused",
    });

    expect(playDisconnectedSound).not.toHaveBeenCalled();
    expect(playOpponentDisconnectedHaptic).toHaveBeenCalledTimes(1);
  });

  it("plays reconnect haptic when sounds are disabled but haptics are enabled", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        soundEnabled: false,
        hapticsEnabled: true,
        status: "paused",
      },
    });

    rerender({
      ...baseParams,
      soundEnabled: false,
      hapticsEnabled: true,
      status: "playing",
    });

    expect(playConnectedSound).not.toHaveBeenCalled();
    expect(playOpponentReconnectedHaptic).toHaveBeenCalledTimes(1);
  });

  it("does not play connectivity feedback for unrelated status transitions", () => {
    const { rerender } = renderHook((props: Params) => useMatchSound(props), {
      initialProps: {
        ...baseParams,
        status: "playing",
      },
    });

    rerender({
      ...baseParams,
      status: "ended",
    });

    expect(playConnectedSound).not.toHaveBeenCalled();
    expect(playDisconnectedSound).not.toHaveBeenCalled();
    expect(playOpponentDisconnectedHaptic).not.toHaveBeenCalled();
    expect(playOpponentReconnectedHaptic).not.toHaveBeenCalled();
  });
});

describe("useMatchResultOverlaySound", () => {
  beforeEach(() => {
    vi.mocked(playVictorySound).mockClear();
    vi.mocked(playDefeatSound).mockClear();
    vi.mocked(playSurrenderSound).mockClear();
    vi.mocked(stopResultSound).mockClear();
    vi.mocked(playVictoryOverlayHaptic).mockClear();
    vi.mocked(playDefeatOverlayHaptic).mockClear();
    vi.mocked(playAbandonedWinHaptic).mockClear();
  });

  it("does not replay the same haptic key when dependencies change without action-key change", () => {
    const { rerender } = renderHook(
      (props: { abandonedBy: "P1" | "P2" | null }) =>
        useMatchResultOverlaySound({
          soundEnabled: false,
          hapticsEnabled: true,
          status: "ended",
          endedReason: "win",
          winner: "P1",
          abandonedBy: props.abandonedBy,
          p1UserId: "user-1",
          currentUserId: "user-1",
        }),
      {
        initialProps: { abandonedBy: null },
      },
    );

    expect(playVictoryOverlayHaptic).toHaveBeenCalledTimes(1);

    rerender({ abandonedBy: "P2" });

    expect(playVictoryOverlayHaptic).toHaveBeenCalledTimes(1);
    expect(playDefeatOverlayHaptic).not.toHaveBeenCalled();
    expect(playAbandonedWinHaptic).not.toHaveBeenCalled();
  });

  it("does not play result haptic for ended reasons other than win/abandoned", () => {
    renderHook(() =>
      useMatchResultOverlaySound({
        soundEnabled: true,
        hapticsEnabled: true,
        status: "ended",
        endedReason: "disconnect",
        winner: "P1",
        abandonedBy: null,
        p1UserId: "user-1",
        currentUserId: "user-1",
      }),
    );

    expect(playVictoryOverlayHaptic).not.toHaveBeenCalled();
    expect(playDefeatOverlayHaptic).not.toHaveBeenCalled();
    expect(playAbandonedWinHaptic).not.toHaveBeenCalled();
  });
});
