import { useEffect, useRef, useState } from "react";

import { useGameById } from "@/infrastructure/convex/GameApi";

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

export const useGame = (gameId?: string | null) => useGameById(gameId);

export const useTurnTimer = ({
  isActive,
  durationMs,
  deadlineTime,
  intervalMs = 100,
  expireDelayMs = 0,
  onExpire,
}: UseTurnTimerParams): UseTurnTimerResult => {
  const [now, setNow] = useState(() => Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

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
    if (!isExpired || hasTriggeredRef.current || !onExpireRef.current) {
      return;
    }

    hasTriggeredRef.current = true;
    if (expireDelayMs <= 0) {
      void onExpireRef.current();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      void onExpireRef.current?.();
    }, expireDelayMs);
  }, [expireDelayMs, isExpired]);

  return { isExpired, remainingMs, progress };
};
