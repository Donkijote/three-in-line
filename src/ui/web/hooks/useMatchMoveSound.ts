import { useEffect, useRef } from "react";

import type { Game, GameId, PlayerSlot } from "@/domain/entities/Game";
import { playPlayerMarkSound } from "@/ui/web/lib/sound";

type UseMatchMoveSoundParams = {
  gameId: GameId;
  lastMove: Game["lastMove"] | undefined;
  currentSlot: PlayerSlot | null;
  isGameReady: boolean;
  isMoveSoundEnabled: boolean;
};

export const useMatchMoveSound = ({
  gameId,
  lastMove,
  currentSlot,
  isGameReady,
  isMoveSoundEnabled,
}: UseMatchMoveSoundParams): void => {
  const lastObservedMoveKeyRef = useRef<string | null>(null);
  const observedGameIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (observedGameIdRef.current !== gameId) {
      observedGameIdRef.current = gameId;
      lastObservedMoveKeyRef.current = null;
      hasInitializedRef.current = false;
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

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
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
};
