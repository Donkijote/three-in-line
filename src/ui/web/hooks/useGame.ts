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
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const triggerHeartbeat = useCallback(async () => {
    const currentGameId = gameIdRef.current;
    if (!currentGameId || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    try {
      await heartbeatRef.current({ gameId: currentGameId });
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
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      void triggerHeartbeat();
    }, delay);
  }, [triggerHeartbeat]);

  const startInterval = useCallback(() => {
    if (intervalIdRef.current !== null || !gameIdRef.current) {
      return;
    }

    intervalIdRef.current = setInterval(() => {
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
  expireDelayMs?: number;
  onExpire?: () => Promise<void>;
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
  expireDelayMs = 0,
  onExpire,
}: UseTurnTimerParams): UseTurnTimerResult => {
  const [now, setNow] = useState(() => Date.now());
  const timeoutRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMs, isActive]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to clean up when these deps update
  useEffect(() => {
    hasTriggeredRef.current = false;
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [deadlineTime, durationMs, isActive, expireDelayMs]);

  const hasTimer = Boolean(durationMs);
  const resolvedDeadline = deadlineTime ?? null;
  const isExpired =
    isActive && resolvedDeadline !== null && now > resolvedDeadline && hasTimer;
  const rawRemainingMs = resolvedDeadline === null ? 0 : resolvedDeadline - now;
  const remainingMs = hasTimer
    ? clamp(rawRemainingMs, 0, durationMs as number)
    : 0;
  const progress = hasTimer ? remainingMs / (durationMs as number) : 0;

  useEffect(() => {
    if (!isExpired || !onExpire || hasTriggeredRef.current) {
      return;
    }

    hasTriggeredRef.current = true;
    if (expireDelayMs <= 0) {
      void onExpire();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      void onExpire();
    }, expireDelayMs);
  }, [expireDelayMs, isExpired, onExpire]);

  return { isExpired, remainingMs, progress };
};
