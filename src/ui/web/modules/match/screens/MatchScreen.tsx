import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import type { GameId } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { FullPageLoader } from "@/ui/web/components/FullPageLoader";
import { Header } from "@/ui/web/components/Header";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { useGame, useGameHeartbeat } from "@/ui/web/hooks/useGame";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { useCurrentUser, useUserById } from "@/ui/web/hooks/useUser";
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
  const navigate = useNavigate();
  const currentUserId = currentUser?.id;
  const opponentId = getOpponentId(game, currentUserId);
  const opponentUser = useUserById(opponentId);
  const gridSize = game?.gridSize;
  const winLength = game?.winLength;
  const matchFormat = game?.match?.format;
  const [isPlacing, setIsPlacing] = useState(false);

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

  const matchPlayersProps = {
    p1UserId: game.p1UserId,
    currentTurn: game.currentTurn,
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
      await placeMarkUseCase(gameRepository, { gameId, index });
    } finally {
      setIsPlacing(false);
    }
  };

  const handleCreateNewGame = async () => {
    if (gridSize == null || winLength == null) {
      return;
    }
    try {
      const nextGameId = await findOrCreateGameUseCase(gameRepository, {
        gridSize,
        winLength,
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
            gridSize={game.gridSize}
            status={game.status}
            currentTurn={game.currentTurn}
            currentUserId={currentUserId}
            p1UserId={game.p1UserId}
            isPlacing={isPlacing}
            onCellClick={handleCellClick}
          />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)] justify-evenly">
          <MatchPlayers {...matchPlayersProps} layout="mobile" />

          <MatchBoard
            board={game.board}
            gridSize={game.gridSize}
            status={game.status}
            currentTurn={game.currentTurn}
            currentUserId={currentUserId}
            p1UserId={game.p1UserId}
            isPlacing={isPlacing}
            onCellClick={handleCellClick}
          />

          <MatchActions gameId={gameId} match={game.match} />
        </div>
      )}
      <MatchResultOverlay
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
