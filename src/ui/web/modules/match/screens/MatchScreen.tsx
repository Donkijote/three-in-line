import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import { timeoutTurnUseCase } from "@/application/games/timeoutTurnUseCase";
import type { GameId, PlayerSlot } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { useUserPreferences } from "@/ui/web/application/providers/UserPreferencesProvider";
import { FullPageLoader } from "@/ui/web/components/FullPageLoader";
import { Header } from "@/ui/web/components/Header";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import {
  useGame,
  useGameHeartbeat,
  useTurnTimer,
} from "@/ui/web/hooks/useGame";
import { useMatchSound } from "@/ui/web/hooks/useMatchSound";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { useCurrentUser, useUserById } from "@/ui/web/hooks/useUser";
import { playPlayerMarkSound } from "@/ui/web/lib/sound";
import { resolvePlayerLabel } from "@/ui/web/lib/user";
import { MatchActions } from "@/ui/web/modules/match/components/MatchActions";
import { MatchBoard } from "@/ui/web/modules/match/components/MatchBoard";
import { MatchPlayers } from "@/ui/web/modules/match/components/MatchPlayers";
import { MatchResultOverlay } from "@/ui/web/modules/match/components/match-result/MatchResultOverlay";

type MatchScreenProps = {
  gameId: GameId;
};

type Game = ReturnType<typeof useGame>;

export const MatchScreen = ({ gameId }: MatchScreenProps) => {
  useGameHeartbeat({ gameId });
  const { isDesktop } = useMediaQuery();
  const game = useGame(gameId);
  const currentUser = useCurrentUser();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const currentUserId = currentUser?.id;
  const opponentId = getOpponentId(game, currentUserId);
  const opponentUser = useUserById(opponentId);
  const [isPlacing, setIsPlacing] = useState(false);
  let currentSlot: PlayerSlot | null = null;
  if (currentUser && game) {
    currentSlot = currentUser.id === game.p1UserId ? "P1" : "P2";
  }
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
    onExpire: () => onExpire(game?.id),
  });
  const isOwnTurnTimerActive = Boolean(
    timerActive && currentSlot && game?.currentTurn === currentSlot,
  );
  const isTimeUpVisible = Boolean(isExpired && isOwnTurnTimerActive);
  useMatchSound({
    gameId,
    status: game?.status,
    lastMove: game?.lastMove,
    currentSlot,
    isGameReady: Boolean(game),
    isMoveSoundEnabled: game?.status === "playing" && preferences.gameSounds,
    soundEnabled: preferences.gameSounds,
    isTimedMode: Boolean(timerEnabled),
    isOwnTurnTimerActive,
    isTimeUpVisible,
    deadlineTime: game?.turnDeadlineTime,
  });

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

  const gridSize = game.gridSize;
  const matchFormat = game.match.format;
  const resolvedCurrentSlot = currentSlot === "P1" ? "P1" : "P2";
  const currentPlayerSymbol = resolvedCurrentSlot === "P1" ? "X" : "O";

  const matchPlayersProps = {
    p1UserId: game.p1UserId,
    currentTurn: game.currentTurn,
    timerActive: Boolean(timerActive),
    timerProgress,
    currentUser,
    opponentUser,
    match: game.match,
  };

  const handleCellClick = async (index: number) => {
    if (isPlacing) {
      return;
    }
    setIsPlacing(true);
    try {
      if (preferences.gameSounds) {
        playPlayerMarkSound(currentPlayerSymbol);
      }
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
        gridSize,
        winLength: game.winLength,
        matchFormat,
        isTimed: game.turnDurationMs !== null,
      });
      await navigate({
        to: "/match",
        search: { gameId: nextGameId },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col no-offset lg:max-w-5xl">
      <Header title="Tic-Tac-Toe" />
      {isDesktop ? (
        <div className="grid grid-cols-[minmax(0,16rem)_minmax(0,1fr)] items-start gap-10 h-[calc(100vh-80px)] content-center">
          <Card className="bg-card shadow-sm h-full py-0">
            <CardContent className="flex h-full flex-col gap-6 px-5 py-6">
              <MatchPlayers {...matchPlayersProps} layout="desktop" />
              <MatchActions
                gameId={gameId}
                match={game.match}
                variant="hud"
                className="mt-auto"
              />
            </CardContent>
          </Card>

          <MatchBoard
            board={game.board}
            gridSize={gridSize}
            status={game.status}
            currentTurn={game.currentTurn}
            currentUserId={currentUserId}
            p1UserId={game.p1UserId}
            isTimeUp={isTimeUpVisible}
            isPlacing={isPlacing}
            onCellClick={handleCellClick}
          />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)] justify-evenly">
          <MatchPlayers {...matchPlayersProps} layout="mobile" />

          <MatchBoard
            board={game.board}
            gridSize={gridSize}
            status={game.status}
            currentTurn={game.currentTurn}
            currentUserId={currentUserId}
            p1UserId={game.p1UserId}
            isTimeUp={isTimeUpVisible}
            isPlacing={isPlacing}
            onCellClick={handleCellClick}
          />

          <MatchActions gameId={gameId} match={game.match} />
        </div>
      )}
      <MatchResultOverlay
        soundEnabled={preferences.gameSounds}
        status={game.status}
        endedReason={game.endedReason}
        winner={game.winner}
        abandonedBy={game.abandonedBy}
        p1UserId={game.p1UserId}
        currentUserId={currentUserId}
        score={game.match?.score}
        onPrimaryAction={handleCreateNewGame}
        currentUser={{
          name: resolvePlayerLabel(currentUser, "You"),
          avatar: currentUser.avatar,
        }}
        opponentUser={{
          name: resolvePlayerLabel(opponentUser, "Opponent"),
          avatar: opponentUser.avatar,
        }}
      />
    </section>
  );
};

const getOpponentId = (game: Game, currentUserId?: string) => {
  if (!game) return undefined;

  if (!currentUserId) {
    return game.p2UserId ?? game.p1UserId;
  }

  return game.p1UserId === currentUserId ? game.p2UserId : game.p1UserId;
};

const onExpire = async (gameId?: string) => {
  if (!gameId) {
    return;
  }
  try {
    await timeoutTurnUseCase(gameRepository, { gameId });
  } catch (error) {
    console.debug("Timeout turn failed.", error);
  }
};
