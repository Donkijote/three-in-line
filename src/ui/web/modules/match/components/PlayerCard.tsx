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
  isTurn: boolean;
  avatar: string;
};

export const PlayerCard = ({
  name,
  symbol,
  wins,
  isTurn,
  avatar,
}: PlayerCardProps) => {
  return (
    <div className={"relative"}>
      <Activity name={"turn-label"} mode={isTurn ? "visible" : "hidden"}>
        <Small className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
          Turn
        </Small>
      </Activity>

      <Card
        className={cn("transition pt-4 pb-3", {
          "ring-2 ring-primary/60 shadow-[0_0_18px_-6px_var(--chart-1)] relative":
            isTurn,
          "opacity-60": !isTurn,
        })}
      >
        <CardContent className="flex flex-col items-center gap-2 pt-1">
          <Avatar
            size={"lg"}
            className={cn("size-16!", {
              "ring-4 ring-primary": isTurn,
              grayscale: !isTurn,
            })}
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
                  "text-primary": isTurn,
                })}
              >
                ({symbol})
              </H6>
            </div>
            <Muted
              className={cn("text-xs text-muted-foreground/50", {
                "text-muted-foreground/70": isTurn,
              })}
            >
              Wins: {wins}
            </Muted>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
