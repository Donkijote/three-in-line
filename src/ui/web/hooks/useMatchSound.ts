import { useEffect, useRef } from "react";

import type { Game, GameId, PlayerSlot } from "@/domain/entities/Game";
import {
  playDefeatSound,
  playPlayerMarkSound,
  playSurrenderSound,
  playTimesUpSound,
  playVictorySound,
  startTimerTickSound,
  stopResultSound,
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

type UseMatchResultOverlaySoundParams = {
  soundEnabled?: boolean;
  status: Game["status"];
  endedReason: Game["endedReason"];
  winner: PlayerSlot | null;
  abandonedBy: PlayerSlot | null;
  p1UserId: string;
  currentUserId?: string;
};

type ResultSoundAction = {
  key: string;
  play: () => void;
} | null;

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

export const useMatchResultOverlaySound = ({
  soundEnabled,
  status,
  endedReason,
  winner,
  abandonedBy,
  p1UserId,
  currentUserId,
}: UseMatchResultOverlaySoundParams): void => {
  const resultSoundKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (shouldResetResultSound(soundEnabled, status)) {
      resetResultSound(resultSoundKeyRef);
      return;
    }

    const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
    const action = resolveResultSoundAction({
      abandonedBy,
      currentSlot,
      currentUserId,
      endedReason,
      winner,
    });

    if (!action) {
      resetResultSound(resultSoundKeyRef);
      return;
    }

    if (resultSoundKeyRef.current === action.key) {
      return;
    }

    resultSoundKeyRef.current = action.key;
    action.play();
  }, [
    abandonedBy,
    currentUserId,
    endedReason,
    p1UserId,
    soundEnabled,
    status,
    winner,
  ]);

  useEffect(() => () => stopResultSound(), []);
};

const shouldResetResultSound = (
  soundEnabled: boolean | undefined,
  status: Game["status"],
): boolean => soundEnabled === false || status !== "ended";

const resetResultSound = (resultSoundKeyRef: { current: string | null }) => {
  stopResultSound();
  resultSoundKeyRef.current = null;
};

const resolveResultSoundAction = ({
  abandonedBy,
  currentSlot,
  currentUserId,
  endedReason,
  winner,
}: {
  abandonedBy: PlayerSlot | null;
  currentSlot: PlayerSlot | undefined;
  currentUserId: string | undefined;
  endedReason: Game["endedReason"];
  winner: PlayerSlot | null;
}): ResultSoundAction => {
  if (!winner) {
    return null;
  }

  const isWinner = currentSlot ? winner === currentSlot : false;
  const userKey = currentUserId ?? "unknown";

  if (endedReason === "win") {
    const type = isWinner ? "victory" : "defeat";
    return {
      key: `${userKey}:${winner}:${type}`,
      play: isWinner ? playVictorySound : playDefeatSound,
    };
  }

  if (endedReason !== "abandoned" || !currentSlot || !abandonedBy) {
    return null;
  }

  const didCurrentUserAbandon = abandonedBy === currentSlot;
  if (didCurrentUserAbandon || !isWinner) {
    return null;
  }

  return {
    key: `${userKey}:${winner}:surrender`,
    play: playSurrenderSound,
  };
};

const resolveCurrentSlot = (
  currentUserId: string | undefined,
  p1UserId: string,
): PlayerSlot | undefined => {
  if (!currentUserId) {
    return undefined;
  }

  return currentUserId === p1UserId ? "P1" : "P2";
};
