import { FullPageLoader } from "@/ui/web/components/FullPageLoader";
import { Header } from "@/ui/web/components/Header";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { useGame } from "@/ui/web/hooks/useGame";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { useCurrentUser, useUserById } from "@/ui/web/hooks/useUser";
import { MatchActions } from "@/ui/web/modules/match/components/MatchActions";
import { MatchBoard } from "@/ui/web/modules/match/components/MatchBoard";
import {
  getOpponentId,
  MatchPlayers,
} from "@/ui/web/modules/match/components/MatchPlayers";

type MatchScreenProps = {
  gameId: string;
};

export const MatchScreen = ({ gameId }: MatchScreenProps) => {
  const { isDesktop } = useMediaQuery();
  const game = useGame(gameId);
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const opponentId = game ? getOpponentId(game, currentUserId) : undefined;
  const opponentUser = useUserById(opponentId);

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
  const matchPlayersProps = {
    game,
    currentUser,
    opponentUser,
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col no-offset lg:max-w-5xl">
      <Header title="Tic-Tac-Toe" />
      {isDesktop ? (
        <div className="grid grid-cols-[minmax(0,16rem)_minmax(0,1fr)] items-start gap-10 h-[calc(100vh-80px)] content-center">
          <Card className="bg-card shadow-sm h-full py-0">
            <CardContent className="flex h-full flex-col gap-6 px-5 py-6">
              <MatchPlayers {...matchPlayersProps} layout="desktop" />
              <MatchActions variant="hud" className="mt-auto" />
            </CardContent>
          </Card>

          <MatchBoard board={game.board} gridSize={gridSize} />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)] justify-evenly">
          <MatchPlayers {...matchPlayersProps} layout="mobile" />

          <MatchBoard board={game.board} gridSize={gridSize} />

          <MatchActions />
        </div>
      )}
    </section>
  );
};
