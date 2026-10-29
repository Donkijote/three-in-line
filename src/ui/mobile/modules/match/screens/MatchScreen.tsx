import { useEffect, useRef, useState } from "react";

import { router } from "expo-router";
import { AppState, View } from "react-native";

import { abandonGameUseCase } from "@/application/games/abandonGameUseCase";
import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { heartbeatUseCase } from "@/application/games/heartbeatUseCase";
import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import { timeoutTurnUseCase } from "@/application/games/timeoutTurnUseCase";
import type { GameId } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { FullPageLoader } from "@/ui/mobile/components/FullPageLoader";
import { MatchActions } from "@/ui/mobile/modules/match/components/MatchActions";
import { MatchBoard } from "@/ui/mobile/modules/match/components/MatchBoard";
import { MatchPlayers } from "@/ui/mobile/modules/match/components/MatchPlayers";
import { MatchResultOverlay } from "@/ui/mobile/modules/match/components/match-result/MatchResultOverlay";
import { MatchErrorScreen } from "@/ui/mobile/modules/match/screens/MatchErrorScreen";
import { useGame, useTurnTimer } from "@/ui/shared/match/hooks/useGame";
import { getOpponentId, resolveCurrentSlot } from "@/ui/shared/match/utils";
import { useCurrentUser, useUserById } from "@/ui/shared/user/hooks/useUser";
import { resolvePlayerLabel } from "@/ui/shared/user/resolvePlayerLabel";

type MatchScreenProps = {
  gameId?: GameId;
};

const HEARTBEAT_INTERVAL_MS = 20_000;
const HEARTBEAT_JITTER_MS = 1_500;

export const MatchScreen = ({ gameId }: MatchScreenProps) => {
  useGameHeartbeat(gameId);

  const { setHeader } = useMobileHeader();
  const game = useGame(gameId);
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const opponentId = getOpponentId(game, currentUserId);
  const opponentUser = useUserById(opponentId);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const currentSlot =
    currentUser && game
      ? (resolveCurrentSlot(currentUser.id, game.p1UserId) ?? null)
      : null;
  const timerEnabled = game?.turnDurationMs !== null;
  const timerActive =
    Boolean(timerEnabled) &&
    game?.status === "playing" &&
    game.turnDeadlineTime !== null;
  const { isExpired, progress: timerProgress } = useTurnTimer({
    isActive: Boolean(timerActive),
    durationMs: game?.turnDurationMs,
    deadlineTime: game?.turnDeadlineTime,
    expireDelayMs: 1200,
    onExpire: () => handleExpire(game?.id),
  });
  const isOwnTurnTimerActive = Boolean(
    timerActive && currentSlot && game?.currentTurn === currentSlot,
  );
  const isTimeUpVisible = Boolean(isExpired && isOwnTurnTimerActive);

  useEffect(() => {
    setHeader({
      title: "Tic Tac Toe",
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  if (!gameId) {
    return (
      <MatchErrorScreen
        title="Missing match"
        description="A game id is required before the mobile match screen can load."
      />
    );
  }

  if (!game || !currentUser) {
    return (
      <FullPageLoader
        label="Match"
        message="Loading match"
        subMessage="Syncing the latest game state."
      />
    );
  }

  if ((game.status === "waiting" && !game.p2UserId) || !opponentUser) {
    return (
      <FullPageLoader
        label="Match"
        message="Waiting for opponent"
        subMessage="Waiting for the second player to connect."
      />
    );
  }

  const handleCellPress = async (index: number) => {
    if (isPlacing) {
      return;
    }

    setIsPlacing(true);
    try {
      await placeMarkUseCase(gameRepository, { gameId, index });
    } catch (error) {
      console.debug("Place mark failed.", error);
    } finally {
      setIsPlacing(false);
    }
  };

  const handleCreateNewGame = async () => {
    try {
      const nextGameId = await findOrCreateGameUseCase(gameRepository, {
        gridSize: game.gridSize,
        winLength: game.winLength,
        matchFormat: game.match.format,
        isTimed: game.turnDurationMs !== null,
      });

      router.replace({
        pathname: "/match",
        params: { gameId: nextGameId },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAbandonMatch = async () => {
    if (!gameId || isAbandoning) {
      return;
    }

    setIsAbandoning(true);
    try {
      await abandonGameUseCase(gameRepository, { gameId });
      router.replace("/play");
    } finally {
      setIsAbandoning(false);
    }
  };

  return (
    <>
      <View className="flex-1 justify-around gap-6 pb-10">
        <MatchPlayers
          p1UserId={game.p1UserId}
          currentTurn={game.currentTurn}
          timerActive={Boolean(timerActive)}
          timerProgress={timerProgress}
          currentUser={currentUser}
          opponentUser={opponentUser}
          match={game.match}
        />

        <MatchBoard
          board={game.board}
          gridSize={game.gridSize}
          status={game.status}
          currentTurn={game.currentTurn}
          currentUserId={currentUserId}
          p1UserId={game.p1UserId}
          isTimeUp={isTimeUpVisible}
          isPlacing={isPlacing}
          onCellPress={handleCellPress}
        />

        <MatchActions
          match={game.match}
          isAbandoning={isAbandoning}
          onAbandonMatch={handleAbandonMatch}
        />
      </View>

      <MatchResultOverlay
        status={game.status}
        endedReason={game.endedReason}
        winner={game.winner}
        abandonedBy={game.abandonedBy}
        p1UserId={game.p1UserId}
        currentUserId={currentUserId}
        score={game.match?.score}
        currentUser={{
          name: resolvePlayerLabel(currentUser, "You"),
          avatar: currentUser.avatar,
        }}
        opponentUser={{
          name: resolvePlayerLabel(opponentUser, "Opponent"),
          avatar: opponentUser.avatar,
        }}
        onPrimaryAction={handleCreateNewGame}
      />
    </>
  );
};

const handleExpire = async (gameId?: string) => {
  if (!gameId) {
    return;
  }

  try {
    await timeoutTurnUseCase(gameRepository, { gameId });
  } catch (error) {
    console.debug("Timeout turn failed.", error);
  }
};

const useGameHeartbeat = (gameId?: GameId) => {
  const gameIdRef = useRef<GameId | undefined>(gameId);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  useEffect(() => {
    const stop = () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };

    const triggerHeartbeat = async () => {
      const activeGameId = gameIdRef.current;
      if (!activeGameId || inFlightRef.current) {
        return;
      }

      inFlightRef.current = true;
      try {
        await heartbeatUseCase(gameRepository, { gameId: activeGameId });
      } catch (error) {
        console.debug("Game heartbeat failed.", error);
      } finally {
        inFlightRef.current = false;
      }
    };

    const triggerHeartbeatWithJitter = () => {
      const delay = Math.floor(Math.random() * (HEARTBEAT_JITTER_MS + 1));

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
    };

    const startInterval = () => {
      if (intervalIdRef.current !== null || !gameIdRef.current) {
        return;
      }

      intervalIdRef.current = setInterval(() => {
        triggerHeartbeatWithJitter();
      }, HEARTBEAT_INTERVAL_MS);
    };

    if (!gameId) {
      stop();
      return;
    }

    void triggerHeartbeat();
    if (AppState.currentState === "active") {
      startInterval();
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (!gameIdRef.current) {
        stop();
        return;
      }

      if (nextState === "active") {
        void triggerHeartbeat();
        startInterval();
        return;
      }

      stop();
    });

    return () => {
      subscription.remove();
      stop();
    };
  }, [gameId]);
};
