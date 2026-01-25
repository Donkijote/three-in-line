import type { UserAvatar } from "@/domain/entities/Avatar";
import { isPresetAvatarId } from "@/domain/entities/Avatar";
import { getPresetAvatarById } from "@/ui/shared/avatars";
import { FullPageLoader } from "@/ui/web/components/FullPageLoader";
import { Header } from "@/ui/web/components/Header";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { useGame } from "@/ui/web/hooks/useGame";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { useCurrentUser, useUserById } from "@/ui/web/hooks/useUser";
import { getFallbackInitials } from "@/ui/web/lib/utils";
import { MatchActions } from "@/ui/web/modules/match/components/MatchActions";
import { MatchBoard } from "@/ui/web/modules/match/components/MatchBoard";
import { PlayerCard } from "@/ui/web/modules/match/components/PlayerCard";

const resolveAvatarSrc = (avatar?: UserAvatar) => {
  if (!avatar) {
    return undefined;
  }
  if (avatar.type === "preset" && isPresetAvatarId(avatar.value)) {
    return getPresetAvatarById(avatar.value).src;
  }
  return avatar.value;
};

type MatchScreenProps = {
  gameId: string;
};

const toDisplayBoard = (board: Array<"P1" | "P2" | null>, gridSize: number) => {
  return Array.from({ length: gridSize }, (_, row) =>
    board
      .slice(row * gridSize, (row + 1) * gridSize)
      .map((cell) => (cell === "P1" ? "X" : cell === "P2" ? "O" : "")),
  );
};

export const MatchScreen = ({ gameId }: MatchScreenProps) => {
  const { isDesktop } = useMediaQuery();
  const game = useGame(gameId);
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id as unknown as string | undefined;
  const isP1 = game ? !currentUserId || game.p1UserId === currentUserId : true;
  const opponentId = game ? (isP1 ? game.p2UserId : game.p1UserId) : undefined;
  const opponentUser = useUserById(opponentId as string | undefined);

  if (!game) {
    return (
      <FullPageLoader
        label="Match"
        message="Loading match"
        subMessage="Syncing the latest game state."
      />
    );
  }

  if (game.status === "waiting" && !game.p2UserId) {
    return (
      <FullPageLoader
        label="Match"
        message="Waiting for opponent"
        subMessage="Waiting for the second player to connect."
      />
    );
  }

  const gridSize = game.gridSize ?? 3;
  const board = toDisplayBoard(game.board, gridSize);
  const mySymbol: "X" | "O" = isP1 ? "X" : "O";
  const opponentSymbol: "X" | "O" = isP1 ? "O" : "X";
  const myTurnSlot = isP1 ? "P1" : "P2";
  const opponentTurnSlot = isP1 ? "P2" : "P1";
  const myName = resolvePlayerName(currentUser);
  const opponentName = resolvePlayerName(opponentUser);
  const myInitials = getFallbackInitials({
    name: currentUser?.name,
    username: currentUser?.username,
    email: currentUser?.email,
  });
  const opponentInitials = getFallbackInitials({
    name: opponentUser?.name,
    username: opponentUser?.username,
    email: opponentUser?.email,
  });
  const players = [
    {
      id: "player-me",
      name: myName || myInitials,
      symbol: mySymbol,
      wins: 0,
      isTurn: game.currentTurn === myTurnSlot,
      avatar: resolveAvatarSrc(currentUser?.avatar),
    },
    {
      id: "player-opponent",
      name: opponentName || opponentInitials || "P2",
      symbol: opponentSymbol,
      wins: 0,
      isTurn: game.currentTurn === opponentTurnSlot,
      avatar: resolveAvatarSrc(opponentUser?.avatar),
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col no-offset lg:max-w-5xl">
      <Header title="Tic-Tac-Toe" />
      {isDesktop ? (
        <div className="grid grid-cols-[minmax(0,16rem)_minmax(0,1fr)] items-start gap-10 h-[calc(100vh-80px)] content-center">
          <Card className="bg-card shadow-sm h-full py-0">
            <CardContent className="flex h-full flex-col gap-6 px-5 py-6">
              <div className="grid gap-6">
                {players.map((player) => (
                  <PlayerCard key={player.id} {...player} />
                ))}
              </div>
              <MatchActions variant="hud" className="mt-auto" />
            </CardContent>
          </Card>

          <MatchBoard board={board} />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)] justify-evenly">
          <div className="grid grid-cols-2 gap-6">
            {players.map((player) => (
              <PlayerCard key={player.id} {...player} />
            ))}
          </div>

          <MatchBoard board={board} />

          <MatchActions />
        </div>
      )}
    </section>
  );
};
const resolvePlayerName = (
  value?: {
    username?: string | null;
    name?: string | null;
    email?: string | null;
  } | null,
) => {
  if (value?.username) {
    return value.username;
  }
  if (value?.name) {
    return value.name;
  }
  if (value?.email) {
    return value.email.split("@")[0] ?? value.email;
  }
  return "";
};
