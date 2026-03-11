import { act, renderHook } from "@testing-library/react";

import type { GameId } from "@/domain/entities/Game";

import { useGame, useGameHeartbeat, useTurnTimer } from "./useGame";

const { heartbeatUseCaseMock, useGameByIdMock } = vi.hoisted(() => ({
  heartbeatUseCaseMock: vi.fn(),
  useGameByIdMock: vi.fn(),
}));

vi.mock("@/application/games/heartbeatUseCase", () => ({
  heartbeatUseCase: heartbeatUseCaseMock,
}));

vi.mock("@/infrastructure/convex/GameApi", () => ({
  useGameById: useGameByIdMock,
}));

vi.mock("@/infrastructure/convex/repository/gameRepository", () => ({
  gameRepository: {
    heartbeat: vi.fn(),
  },
}));

describe("useGame", () => {
  let visibilityState: DocumentVisibilityState;
  const flushMicrotasks = async () => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  beforeEach(() => {
    visibilityState = "visible";
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => visibilityState,
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-12T12:00:00.000Z"));
    heartbeatUseCaseMock.mockReset();
    heartbeatUseCaseMock.mockResolvedValue(undefined);
    useGameByIdMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("skips the query when no game id is provided", () => {
    useGameByIdMock.mockReturnValue(null);

    const { result } = renderHook(() => useGame(null));

    expect(useGameByIdMock).toHaveBeenCalledWith(null);
    expect(result.current).toBe(null);
  });

  it("fetches game data when a game id is provided", () => {
    const response = { id: "game-1" };
    useGameByIdMock.mockReturnValue(response);

    const { result } = renderHook(() => useGame("game-1"));

    expect(useGameByIdMock).toHaveBeenCalledWith("game-1");
    expect(result.current).toEqual(response);
  });

  it("sends heartbeat immediately and on interval when visible", async () => {
    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 1_000,
        jitterMs: 0,
      }),
    );

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);
    expect(heartbeatUseCaseMock).toHaveBeenLastCalledWith(expect.any(Object), {
      gameId: "game-1",
    });
    await flushMicrotasks();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(2);
  });

  it("does not send heartbeat when game id is missing", () => {
    renderHook(() =>
      useGameHeartbeat({
        gameId: undefined,
        intervalMs: 1_000,
        jitterMs: 0,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(heartbeatUseCaseMock).not.toHaveBeenCalled();
  });

  it("stops while hidden and resumes on visibility change", async () => {
    visibilityState = "hidden";
    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 1_000,
        jitterMs: 0,
      }),
    );

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);
    await flushMicrotasks();
    act(() => {
      vi.advanceTimersByTime(2_000);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);

    act(() => {
      visibilityState = "visible";
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await flushMicrotasks();
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(2);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(3);

    act(() => {
      visibilityState = "hidden";
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(2_000);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(3);
  });

  it("clears pending jitter timeout before scheduling a new one", async () => {
    vi.spyOn(Math, "random").mockReturnValue(1);
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 10,
        jitterMs: 50,
      }),
    );

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);
    await flushMicrotasks();

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("prevents overlapping heartbeat requests", async () => {
    let resolveHeartbeat: (() => void) | undefined;
    heartbeatUseCaseMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveHeartbeat = resolve;
        }),
    );

    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 10,
        jitterMs: 0,
      }),
    );

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveHeartbeat?.();
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(2);
  });

  it("logs heartbeat errors and keeps the loop running", async () => {
    const debugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => undefined);
    heartbeatUseCaseMock
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue(undefined);

    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 1_000,
        jitterMs: 0,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(debugSpy).toHaveBeenCalledWith(
      "Game heartbeat failed.",
      expect.any(Error),
    );

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(2);
  });

  it("does not restart an active heartbeat interval when timing params change", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const { rerender } = renderHook(
      (props: { intervalMs: number; jitterMs: number }) =>
        useGameHeartbeat({
          gameId: "game-1" as GameId,
          intervalMs: props.intervalMs,
          jitterMs: props.jitterMs,
        }),
      {
        initialProps: { intervalMs: 1_000, jitterMs: 0 },
      },
    );

    await flushMicrotasks();
    clearIntervalSpy.mockClear();
    const intervalsBefore = setIntervalSpy.mock.calls.length;

    rerender({ intervalMs: 500, jitterMs: 250 });

    expect(clearIntervalSpy).not.toHaveBeenCalled();
    expect(setIntervalSpy.mock.calls.length).toBe(intervalsBefore);
  });

  it("does not restart interval settings while document is hidden", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { rerender } = renderHook(
      (props: { intervalMs: number; jitterMs: number }) =>
        useGameHeartbeat({
          gameId: "game-1" as GameId,
          intervalMs: props.intervalMs,
          jitterMs: props.jitterMs,
        }),
      {
        initialProps: { intervalMs: 1_000, jitterMs: 0 },
      },
    );

    await flushMicrotasks();
    clearIntervalSpy.mockClear();
    visibilityState = "hidden";

    rerender({ intervalMs: 500, jitterMs: 250 });

    expect(clearIntervalSpy).not.toHaveBeenCalled();
  });

  it("stops interval on visibility change when game id becomes unavailable", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { rerender } = renderHook(
      (props: { gameId: GameId | undefined }) =>
        useGameHeartbeat({
          gameId: props.gameId,
          intervalMs: 1_000,
          jitterMs: 0,
        }),
      {
        initialProps: { gameId: "game-1" as GameId },
      },
    );

    await flushMicrotasks();
    rerender({ gameId: undefined as unknown as GameId });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("ignores duplicate visible events when the interval already exists", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 1_000,
        jitterMs: 0,
      }),
    );

    await flushMicrotasks();
    clearIntervalSpy.mockClear();

    act(() => {
      visibilityState = "visible";
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(clearIntervalSpy).not.toHaveBeenCalled();
  });

  it("executes jitter timeout callback when delay elapses before next tick", async () => {
    vi.spyOn(Math, "random").mockReturnValue(1);
    renderHook(() =>
      useGameHeartbeat({
        gameId: "game-1" as GameId,
        intervalMs: 100,
        jitterMs: 50,
      }),
    );

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(1);
    await flushMicrotasks();

    act(() => {
      vi.advanceTimersByTime(151);
    });

    expect(heartbeatUseCaseMock).toHaveBeenCalledTimes(2);
  });

  it("returns bounded remaining time and progress while active", () => {
    const start = Date.now();
    const { result, rerender } = renderHook(
      (props: {
        isActive: boolean;
        durationMs: number | null | undefined;
        deadlineTime: number | null | undefined;
      }) =>
        useTurnTimer({
          ...props,
          intervalMs: 100,
        }),
      {
        initialProps: {
          isActive: true,
          durationMs: 5_000,
          deadlineTime: start + 8_000,
        },
      },
    );

    expect(result.current.remainingMs).toBe(5_000);
    expect(result.current.progress).toBe(1);
    expect(result.current.isExpired).toBe(false);

    rerender({
      isActive: true,
      durationMs: 5_000,
      deadlineTime: start + 200,
    });
    expect(result.current.remainingMs).toBe(200);
    expect(result.current.progress).toBeCloseTo(0.04);

    act(() => {
      vi.setSystemTime(start + 400);
      vi.advanceTimersByTime(100);
    });
    expect(result.current.remainingMs).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.isExpired).toBe(true);
  });

  it("calls onExpire once immediately when delay is zero and can trigger again after reset", async () => {
    const start = Date.now();
    const onExpire = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      (props: { deadlineTime: number | null | undefined }) =>
        useTurnTimer({
          isActive: true,
          durationMs: 1_000,
          deadlineTime: props.deadlineTime,
          expireDelayMs: 0,
          onExpire,
        }),
      {
        initialProps: { deadlineTime: start - 1 },
      },
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(onExpire).toHaveBeenCalledTimes(1);

    rerender({ deadlineTime: start + 5_000 });
    await flushMicrotasks();
    expect(onExpire).toHaveBeenCalledTimes(1);

    act(() => {
      vi.setSystemTime(start + 6_000);
      vi.advanceTimersByTime(100);
    });
    rerender({ deadlineTime: start + 5_000 });
    await flushMicrotasks();
    expect(onExpire).toHaveBeenCalledTimes(2);
  });

  it("keeps timer static when inactive", () => {
    const start = Date.now();
    const { result } = renderHook(() =>
      useTurnTimer({
        isActive: false,
        durationMs: 1_000,
        deadlineTime: start - 100,
        intervalMs: 100,
      }),
    );

    expect(result.current.isExpired).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.remainingMs).toBe(0);
  });

  it("handles missing timer inputs", () => {
    const { result } = renderHook(() =>
      useTurnTimer({
        isActive: true,
        durationMs: null,
        deadlineTime: null,
      }),
    );

    expect(result.current.isExpired).toBe(false);
    expect(result.current.remainingMs).toBe(0);
    expect(result.current.progress).toBe(0);
  });

  it("schedules delayed expiration and cancels pending timeout on deps change", () => {
    const start = Date.now();
    const onExpire = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      (props: { deadlineTime: number | null | undefined }) =>
        useTurnTimer({
          isActive: true,
          durationMs: 1_000,
          deadlineTime: props.deadlineTime,
          expireDelayMs: 500,
          onExpire,
          intervalMs: 100,
        }),
      {
        initialProps: { deadlineTime: start - 1 },
      },
    );

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(onExpire).not.toHaveBeenCalled();

    rerender({ deadlineTime: start + 2_000 });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(onExpire).not.toHaveBeenCalled();
  });

  it("fires delayed expiration callback when timeout completes", () => {
    const start = Date.now();
    const onExpire = vi.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useTurnTimer({
        isActive: true,
        durationMs: 1_000,
        deadlineTime: start - 1,
        expireDelayMs: 200,
        onExpire,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});
