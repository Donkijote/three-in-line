import { useEffect, useRef } from "react";

import type { Game, GameId, PlayerSlot } from "@/domain/entities/Game";
import {
  playPlayerMarkSound,
  playTimesUpSound,
  startTimerTickSound,
  stopTimerTickSound,
} from "@/ui/web/lib/sound";

type UseMatchSoundParams = {
  gameId: GameId;
  lastMove: Game["lastMove"] | undefined;
  currentSlot: PlayerSlot | null;
  isGameReady: boolean;
  isMoveSoundEnabled: boolean;
  soundEnabled: boolean;
  isTimedMode: boolean;
  isOwnTurnTimerActive: boolean;
  isTimeUpVisible: boolean;
  deadlineTime: number | null | undefined;
};

export const useMatchSound = ({
  gameId,
  lastMove,
  currentSlot,
  isGameReady,
  isMoveSoundEnabled,
  soundEnabled,
  isTimedMode,
  isOwnTurnTimerActive,
  isTimeUpVisible,
  deadlineTime,
}: UseMatchSoundParams): void => {
  const lastObservedMoveKeyRef = useRef<string | null>(null);
  const observedMoveGameIdRef = useRef<string | null>(null);
  const hasInitializedMoveRef = useRef(false);
  const lastTimesUpKeyRef = useRef<string | null>(null);
  const observedTimesUpGameIdRef = useRef<GameId | null>(null);

  useEffect(() => {
    if (observedMoveGameIdRef.current !== gameId) {
      observedMoveGameIdRef.current = gameId;
      lastObservedMoveKeyRef.current = null;
      hasInitializedMoveRef.current = false;
    }

    if (!isGameReady) {
      return;
    }

    if (!isMoveSoundEnabled) {
      if (lastMove) {
        lastObservedMoveKeyRef.current = `${lastMove.at}:${lastMove.index}:${lastMove.by}`;
      }
      return;
    }

    if (!hasInitializedMoveRef.current) {
      hasInitializedMoveRef.current = true;
      if (lastMove) {
        lastObservedMoveKeyRef.current = `${lastMove.at}:${lastMove.index}:${lastMove.by}`;
      }
      return;
    }

    if (!lastMove) {
      return;
    }

    const moveKey = `${lastMove.at}:${lastMove.index}:${lastMove.by}`;
    if (lastObservedMoveKeyRef.current === moveKey) {
      return;
    }

    lastObservedMoveKeyRef.current = moveKey;
    if (lastMove.by === currentSlot) {
      return;
    }

    playPlayerMarkSound(lastMove.by === "P1" ? "X" : "O");
  }, [currentSlot, gameId, isGameReady, isMoveSoundEnabled, lastMove]);

  useEffect(() => {
    const shouldTick =
      soundEnabled && isTimedMode && isOwnTurnTimerActive && !isTimeUpVisible;

    if (shouldTick) {
      startTimerTickSound();
      return;
    }

    stopTimerTickSound();
  }, [isOwnTurnTimerActive, isTimeUpVisible, isTimedMode, soundEnabled]);

  useEffect(() => {
    if (observedTimesUpGameIdRef.current !== gameId) {
      observedTimesUpGameIdRef.current = gameId;
      lastTimesUpKeyRef.current = null;
    }

    if (
      !soundEnabled ||
      !isTimedMode ||
      !isOwnTurnTimerActive ||
      !isTimeUpVisible
    ) {
      return;
    }

    const timesUpKey = `${gameId}:${deadlineTime ?? "none"}`;
    if (lastTimesUpKeyRef.current === timesUpKey) {
      return;
    }

    lastTimesUpKeyRef.current = timesUpKey;
    playTimesUpSound();
  }, [
    deadlineTime,
    gameId,
    isOwnTurnTimerActive,
    isTimeUpVisible,
    isTimedMode,
    soundEnabled,
  ]);

  useEffect(() => () => stopTimerTickSound(), []);
};
