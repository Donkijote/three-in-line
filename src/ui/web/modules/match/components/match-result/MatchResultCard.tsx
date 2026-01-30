import { Activity } from "react";

import type { UserAvatar } from "@/domain/entities/Avatar";
import { Small } from "@/ui/web/components/Typography";
import { Badge } from "@/ui/web/components/ui/badge";
import { Card, CardFooter } from "@/ui/web/components/ui/card";
import { Separator } from "@/ui/web/components/ui/separator";
import { cn } from "@/ui/web/lib/utils";
import { MatchResultPlayerBadge } from "@/ui/web/modules/match/components/MatchResultPlayerBadge";

type MatchResultCardProps = {
  currentUser: {
    name: string;
    avatar?: UserAvatar;
  };
  opponentUser: {
    name: string;
    avatar?: UserAvatar;
  };
  isWinner: boolean;
  isAbandonedByCurrentUser?: boolean;
  pill?: string;
  footer?: string;
  score?: {
    current: number;
    opponent: number;
  };
};

export const MatchResultCard = ({
  currentUser,
  opponentUser,
  isWinner,
  isAbandonedByCurrentUser,
  pill,
  footer,
  score,
}: MatchResultCardProps) => {
  const isDisconnected = typeof isAbandonedByCurrentUser === "boolean";
  const isCurrentWinner = isDisconnected
    ? !isAbandonedByCurrentUser
    : Boolean(isWinner);
  const currentAccent = isCurrentWinner ? "primary" : "destructive";
  const opponentAccent = isCurrentWinner ? "destructive" : "primary";
  const middleLabel = isDisconnected ? "Match\nResult" : "Final\nResult";

  return (
    <Card className="w-full max-w-sm rounded-4xl bg-card/80 p-6 shadow-[0_0_30px_-18px_rgba(0,0,0,0.8)]">
      <Activity name={"pill"} mode={pill ? "visible" : "hidden"}>
        <div>
          <Badge className={"bg-primary/30"}>{pill}</Badge>
        </div>
      </Activity>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <MatchResultPlayerBadge
            name={currentUser.name}
            avatar={currentUser.avatar}
            isWinner={isCurrentWinner}
            accent={currentAccent}
            label="You"
          />
          <Activity name={"score-left"} mode={score ? "visible" : "hidden"}>
            <span
              className={cn("text-2xl font-semibold", {
                "text-primary": isCurrentWinner,
                "text-destructive": !isCurrentWinner,
              })}
            >
              {score?.current}
            </span>
          </Activity>
        </div>
        <div className="grid place-items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          <Small className="text-[10px] whitespace-pre-line text-center leading-relaxed">
            {middleLabel}
          </Small>
        </div>
        <div className="flex items-center gap-6">
          <Activity name={"score-right"} mode={score ? "visible" : "hidden"}>
            <span
              className={cn("text-2xl font-semibold", {
                "text-destructive": isCurrentWinner,
                "text-primary": !isCurrentWinner,
              })}
            >
              {score?.opponent}
            </span>
          </Activity>
          <MatchResultPlayerBadge
            name={opponentUser.name}
            avatar={opponentUser.avatar}
            isWinner={!isCurrentWinner}
            accent={opponentAccent}
            label="Opponent"
          />
        </div>
      </div>
      <Activity name={"footer"} mode={footer ? "visible" : "hidden"}>
        <CardFooter className={"flex flex-col p-0"}>
          <Separator className={"bg-primary/30"} />
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {footer}
          </div>
        </CardFooter>
      </Activity>
    </Card>
  );
};
