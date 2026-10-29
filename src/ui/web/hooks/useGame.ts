import { useEffect, useEffectEvent, useRef } from "react";

import { heartbeatUseCase } from "@/application/games/heartbeatUseCase";
import type { GameId } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

export {
  useGame,
  useTurnTimer,
} from "@/ui/shared/match/hooks/useGame";

type HeartbeatParams = {
  gameId?: GameId;
  intervalMs?: number;
  jitterMs?: number;
};

const DEFAULT_INTERVAL_MS = 20_000;
const DEFAULT_JITTER_MS = 1_500;

const sendHeartbeat = (params: { gameId: GameId }) =>
  heartbeatUseCase(gameRepository, params);

export const useGameHeartbeat = ({
  gameId,
  intervalMs = DEFAULT_INTERVAL_MS,
  jitterMs = DEFAULT_JITTER_MS,
}: HeartbeatParams): void => {
  const gameIdRef = useRef<GameId | undefined>(gameId);
  const intervalMsRef = useRef(intervalMs);
  const jitterMsRef = useRef(jitterMs);
  const intervalIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const stopInterval = useEffectEvent(() => {
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
  });

  const triggerHeartbeat = useEffectEvent(async () => {
    const currentGameId = gameIdRef.current;
    if (!currentGameId || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    try {
      await sendHeartbeat({ gameId: currentGameId });
    } catch (error) {
      console.debug("Game heartbeat failed.", error);
    } finally {
      inFlightRef.current = false;
    }
  });

  const triggerHeartbeatWithJitter = useEffectEvent(() => {
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
  });

  const startInterval = useEffectEvent(() => {
    if (intervalIdRef.current !== null || !gameIdRef.current) {
      return;
    }

    intervalIdRef.current = setInterval(() => {
      triggerHeartbeatWithJitter();
    }, intervalMsRef.current);
  });

  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  useEffect(() => {
    intervalMsRef.current = intervalMs;
    jitterMsRef.current = jitterMs;
  }, [intervalMs, jitterMs]);

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
  }, [gameId]);

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
  }, []);
};
