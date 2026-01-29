import { Activity } from "react";

import { H6, Muted, Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

type PlayerCardProps = {
  name: string;
  symbol: "X" | "O";
  wins: number;
  showWins: boolean;
  isTurn: boolean;
  avatar?: string;
  accent: "primary" | "opponent";
};

export const PlayerCard = ({
  name,
  symbol,
  wins,
  showWins,
  isTurn,
  avatar,
  accent,
}: PlayerCardProps) => {
  const accentClasses =
    accent === "opponent"
      ? {
          badge: "bg-opponent text-opponent-foreground",
          ring: "ring-opponent/60",
          avatarRing: "ring-opponent",
          symbol: "text-opponent",
          shadow: "shadow-[0_0_18px_-6px_var(--opponent)]",
        }
      : {
          badge: "bg-primary text-primary-foreground",
          ring: "ring-primary/60",
          avatarRing: "ring-primary",
          symbol: "text-primary",
          shadow: "shadow-[0_0_18px_-6px_var(--chart-1)]",
        };

  return (
    <div className={"relative"}>
      <Activity name={"turn-label"} mode={isTurn ? "visible" : "hidden"}>
        <Small
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
            accentClasses.badge,
          )}
        >
          Turn
        </Small>
      </Activity>

      <Card
        className={cn(
          "transition pt-4 pb-3",
          {
            "ring-2 relative": isTurn,
            "opacity-60": !isTurn,
          },
          isTurn && accentClasses.ring,
          isTurn && accentClasses.shadow,
        )}
      >
        <CardContent className="flex flex-col items-center gap-2 pt-1">
          <Avatar
            size={"lg"}
            className={cn(
              "size-16!",
              {
                "ring-4": isTurn,
                grayscale: !isTurn,
              },
              isTurn && accentClasses.avatarRing,
            )}
          >
            <AvatarImage
              src={avatar}
              alt={name}
              className={cn({
                "ring-2 ring-black": isTurn,
              })}
            />
            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <H6 className="text-base font-semibold">{name}</H6>
              <H6
                className={cn("text-muted-foreground", {
                  [accentClasses.symbol]: isTurn,
                })}
              >
                ({symbol})
              </H6>
            </div>
            <Activity
              name={"current-wins"}
              mode={showWins ? "visible" : "hidden"}
            >
              <Muted
                className={cn("text-xs text-muted-foreground/50", {
                  "text-muted-foreground/70": isTurn,
                })}
              >
                Wins: {wins}
              </Muted>
            </Activity>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
