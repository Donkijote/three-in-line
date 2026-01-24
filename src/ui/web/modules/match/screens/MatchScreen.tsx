import { Activity } from "react";

import { Flag, RotateCcw } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { Header } from "@/ui/web/components/Header";
import { H6, Muted, Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { Button } from "@/ui/web/components/ui/button";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

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
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col no-offset lg:max-w-5xl">
      <Header title="Tic-Tac-Toe" />
      <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-10 h-[calc(100vh-80px)] content-evenly">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
          {players.map((player) => (
            <div key={player.id} className={"relative"}>
              <Activity
                name={"turn-label"}
                mode={player.isTurn ? "visible" : "hidden"}
              >
                <Small className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Turn
                </Small>
              </Activity>

              <Card
                className={cn("transition pt-4 pb-3", {
                  "ring-2 ring-primary/60 shadow-[0_0_18px_-6px_var(--chart-1)] relative":
                    player.isTurn,
                  "opacity-60": !player.isTurn,
                })}
              >
                <CardContent className="flex flex-col items-center gap-2 pt-1">
                  <Avatar
                    size={"lg"}
                    className={cn("size-16!", {
                      "ring-4 ring-primary": player.isTurn,
                      grayscale: !player.isTurn,
                    })}
                  >
                    <AvatarImage
                      src={player.avatar}
                      alt={player.name}
                      className={cn({
                        "ring-2 ring-black": player.isTurn,
                      })}
                    />
                    <AvatarFallback>{player.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <H6 className="text-base font-semibold">{player.name}</H6>
                      <H6
                        className={cn("text-muted-foreground", {
                          "text-primary": player.isTurn,
                        })}
                      >
                        ({player.symbol})
                      </H6>
                    </div>
                    <Muted
                      className={cn("text-xs text-muted-foreground/50", {
                        "text-muted-foreground/70": player.isTurn,
                      })}
                    >
                      Wins: {player.wins}
                    </Muted>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Card className="px-4 py-4 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.5)] lg:col-start-2 lg:row-span-2">
          <div className="grid grid-cols-3 gap-3">
            {board.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                return (
                  <div
                    key={key}
                    className="grid aspect-square place-items-center rounded-2xl border border-border/70 bg-secondary text-3xl font-semibold"
                  >
                    <span
                      className={cn(
                        cell === "X" && "text-primary",
                        cell === "O" && "text-foreground/90",
                      )}
                    >
                      {cell || ""}
                    </span>
                  </div>
                );
              }),
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-3 md:flex-row md:justify-center lg:col-start-1 lg:items-start lg:justify-start lg:gap-4">
          <Button className="h-12 text-sm font-semibold">
            <RotateCcw className="size-4" />
            Reset Round
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 text-sm font-semibold"
          >
            <Link to="/play" aria-label="Abandon match">
              <Flag className="size-4 text-destructive" />
              <span className="text-destructive">Abandon Match</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1 pt-2 lg:col-start-1 lg:items-start">
          <Muted className="text-xs text-muted-foreground">Round 6</Muted>
          <Muted className="text-xs text-muted-foreground">Best of 10</Muted>
        </div>
      </div>
    </section>
  );
};
