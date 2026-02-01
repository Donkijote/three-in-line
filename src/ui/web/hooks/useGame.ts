import { useCallback, useEffect, useRef, useState } from "react";

import { heartbeatUseCase } from "@/application/games/heartbeatUseCase";
import type { GameId } from "@/domain/entities/Game";
import { useGameById } from "@/infrastructure/convex/GameApi";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

type HeartbeatParams = {
  gameId?: GameId;
  intervalMs?: number;
  jitterMs?: number;
};

const DEFAULT_INTERVAL_MS = 20_000;
const DEFAULT_JITTER_MS = 1_500;

export const useGame = (gameId?: string | null) => useGameById(gameId);

const sendHeartbeat = (params: { gameId: GameId }) =>
  heartbeatUseCase(gameRepository, params);

export const useGameHeartbeat = ({
  gameId,
  intervalMs = DEFAULT_INTERVAL_MS,
  jitterMs = DEFAULT_JITTER_MS,
}: HeartbeatParams): void => {
  const gameIdRef = useRef<GameId | undefined>(gameId);
  const heartbeatRef = useRef(sendHeartbeat);
  const intervalMsRef = useRef(intervalMs);
  const jitterMsRef = useRef(jitterMs);
  const intervalIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const stopInterval = useCallback(() => {
    if (intervalIdRef.current === null) {
      if (timeoutIdRef.current === null) {
        return;
      }
    }

    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const triggerHeartbeat = useCallback(async () => {
    const currentGameId = gameIdRef.current;
    if (!currentGameId || inFlightRef.current) {
      return;
    }

    const heartbeatFn = heartbeatRef.current;
    if (!heartbeatFn) {
      return;
    }

    inFlightRef.current = true;
    try {
      await heartbeatFn({ gameId: currentGameId });
    } catch (error) {
      console.debug("Game heartbeat failed.", error);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const triggerHeartbeatWithJitter = useCallback(() => {
    const jitter = jitterMsRef.current;
    const delay = jitter > 0 ? Math.floor(Math.random() * (jitter + 1)) : 0;

    if (delay === 0) {
      void triggerHeartbeat();
      return;
    }

    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = window.setTimeout(() => {
      void triggerHeartbeat();
    }, delay);
  }, [triggerHeartbeat]);

  const startInterval = useCallback(() => {
    if (intervalIdRef.current !== null || !gameIdRef.current) {
      return;
    }

    intervalIdRef.current = window.setInterval(() => {
      triggerHeartbeatWithJitter();
    }, intervalMsRef.current);
  }, [triggerHeartbeatWithJitter]);

  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  useEffect(() => {
    intervalMsRef.current = intervalMs;
    jitterMsRef.current = jitterMs;
  }, [intervalMs, jitterMs]);

  useEffect(() => {
    if (intervalIdRef.current === null) {
      return;
    }

    if (
      typeof document === "undefined" ||
      document.visibilityState !== "visible"
    ) {
      return;
    }

    stopInterval();
    startInterval();
  }, [startInterval, stopInterval]);

  useEffect(() => {
    if (!gameId) {
      stopInterval();
      return;
    }

    if (typeof document !== "undefined") {
      void triggerHeartbeat();
      if (document.visibilityState === "visible") {
        startInterval();
      }
    }
  }, [gameId, startInterval, stopInterval, triggerHeartbeat]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      if (!gameIdRef.current) {
        stopInterval();
        return;
      }

      if (document.visibilityState === "visible") {
        void triggerHeartbeat();
        startInterval();
        return;
      }

      stopInterval();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopInterval();
    };
  }, [startInterval, stopInterval, triggerHeartbeat]);
};

type UseTurnTimerParams = {
  isActive: boolean;
  durationMs: number | null | undefined;
  deadlineTime: number | null | undefined;
  intervalMs?: number;
};

type UseTurnTimerResult = {
  isExpired: boolean;
  remainingMs: number;
  progress: number;
};

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const useTurnTimer = ({
  isActive,
  durationMs,
  deadlineTime,
  intervalMs = 100,
}: UseTurnTimerParams): UseTurnTimerResult => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs, isActive]);

  const hasTimer = Boolean(durationMs);
  const resolvedDeadline = deadlineTime ?? null;
  const isExpired =
    isActive && resolvedDeadline !== null && now > resolvedDeadline && hasTimer;
  const rawRemainingMs = resolvedDeadline !== null ? resolvedDeadline - now : 0;
  const remainingMs = hasTimer
    ? clamp(rawRemainingMs, 0, durationMs as number)
    : 0;
  const progress = hasTimer ? remainingMs / (durationMs as number) : 0;

  return { isExpired, remainingMs, progress };
};
