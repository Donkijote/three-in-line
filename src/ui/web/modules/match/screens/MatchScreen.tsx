import { useState } from "react";

import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import type { GameId } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { FullPageLoader } from "@/ui/web/components/FullPageLoader";
import { Header } from "@/ui/web/components/Header";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { useGame } from "@/ui/web/hooks/useGame";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { useCurrentUser, useUserById } from "@/ui/web/hooks/useUser";
import { MatchActions } from "@/ui/web/modules/match/components/MatchActions";
import { MatchBoard } from "@/ui/web/modules/match/components/MatchBoard";
import { MatchPlayers } from "@/ui/web/modules/match/components/MatchPlayers";

type MatchScreenProps = {
  gameId: GameId;
};

type Game = ReturnType<typeof useGame>;

export const MatchScreen = ({ gameId }: MatchScreenProps) => {
  const { isDesktop } = useMediaQuery();
  const game = useGame(gameId);
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const opponentId = getOpponentId(game, currentUserId);
  const opponentUser = useUserById(opponentId);
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

  const gridSize = game.gridSize ?? 3;
  const isMyTurn =
    game.status === "playing" &&
    isCurrentUserTurn(game, currentUserId) &&
    !isPlacing;
  const matchPlayersProps = {
    game,
    currentUser,
    opponentUser,
  };
  const playerColors = getPlayerColors(game, currentUserId);

  const handleCellClick = async (index: number) => {
    if (!isMyTurn || isPlacing) {
      return;
    }
    setIsPlacing(true);
    try {
      await placeMarkUseCase(gameRepository, { gameId, index });
    } finally {
      setIsPlacing(false);
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
              <MatchActions gameId={gameId} variant="hud" className="mt-auto" />
            </CardContent>
          </Card>

          <MatchBoard
            board={game.board}
            gridSize={gridSize}
            isInteractive={isMyTurn}
            onCellClick={handleCellClick}
            playerColors={playerColors}
          />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)] justify-evenly">
          <MatchPlayers {...matchPlayersProps} layout="mobile" />

          <MatchBoard
            board={game.board}
            gridSize={gridSize}
            isInteractive={isMyTurn}
            onCellClick={handleCellClick}
            playerColors={playerColors}
          />

          <MatchActions gameId={gameId} />
        </div>
      )}
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

const isCurrentUserTurn = (game: Game, currentUserId?: string) => {
  if (!currentUserId || !game) return false;
  const currentSlot = game.p1UserId === currentUserId ? "P1" : "P2";
  return game.currentTurn === currentSlot;
};

const getPlayerColors = (game: Game, currentUserId?: string) => {
  const isP1 = !currentUserId || game.p1UserId === currentUserId;
  return isP1
    ? { P1: "text-primary", P2: "text-opponent" }
    : { P1: "text-opponent", P2: "text-primary" };
};
