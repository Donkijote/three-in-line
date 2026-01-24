import { Header } from "@/ui/web/components/Header";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { MatchActions } from "@/ui/web/modules/match/components/MatchActions";
import { MatchBoard } from "@/ui/web/modules/match/components/MatchBoard";
import { PlayerCard } from "@/ui/web/modules/match/components/PlayerCard";

const players = [
  {
    id: "player-x",
    name: "Alex",
    symbol: "X",
    wins: 3,
    isTurn: true,
    avatar: "/avatars/avatar-3.svg",
  },
  {
    id: "player-o",
    name: "Sam",
    symbol: "O",
    wins: 2,
    isTurn: false,
    avatar: "/avatars/avatar-8.svg",
  },
] as const;

const board = [
  ["X", "O", ""],
  ["", "X", ""],
  ["O", "", ""],
];

export const MatchScreen = () => {
  const { isDesktop } = useMediaQuery();
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
