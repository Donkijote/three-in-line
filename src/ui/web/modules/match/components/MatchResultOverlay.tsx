import { Activity } from "react";

import { HeartCrack, Home, RotateCcw, Trophy } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import type { UserAvatar } from "@/domain/entities/Avatar";
import { H3, Muted, Small } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import { Card } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";
import { MatchResultPlayerBadge } from "@/ui/web/modules/match/components/MatchResultPlayerBadge";

type MatchResultOverlayProps = {
  isOpen: boolean;
  isWinner: boolean;
  currentUser: {
    name: string;
    avatar?: UserAvatar;
  };
  opponentUser: {
    name: string;
    avatar?: UserAvatar;
  };
};

export const MatchResultOverlay = ({
  isOpen,
  isWinner,
  currentUser,
  opponentUser,
}: MatchResultOverlayProps) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const title = isWinner ? "You win!" : "Defeat";
  const subtitle = "Don't give up!\nYou were so close.";
  const primaryLabel = isWinner ? "Play Again" : "Rematch";
  const secondaryLabel = isWinner ? "Back to Home" : "EXIT";
  const accent = isWinner ? "primary" : "destructive";
  const Icon = isWinner ? Trophy : HeartCrack;
  const currentAccent = isWinner ? "primary" : "destructive";
  const opponentAccent = isWinner ? "destructive" : "primary";

  const handleNavigate = () => {
    void navigate({ to: "/play" });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/95 px-6 py-8">
      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute -top-12 left-1/2 size-28 -translate-x-1/2 rounded-full bg-linear-to-b from-black/0 via-black/0 to-black/50 blur-2xl" />
        <div
          className={cn(
            "pointer-events-none absolute -left-12 top-12 size-28 rounded-full blur-3xl",
            isWinner ? "bg-primary/25" : "bg-destructive/25",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-10 bottom-10 size-24 rounded-full blur-3xl",
            isWinner ? "bg-primary/20" : "bg-destructive/20",
          )}
        />

        <div className="flex flex-col items-center gap-20 text-center">
          <div
            className={cn(
              "grid place-items-center",
              isWinner
                ? "text-primary drop-shadow-[0_0_18px_rgba(16,185,129,0.6)]"
                : "text-destructive",
            )}
          >
            <Icon className="size-20" />
          </div>

          <div className="grid gap-4">
            <H3
              className={cn(
                isWinner
                  ? "text-5xl font-semibold tracking-widest uppercase"
                  : "text-4xl font-semibold tracking-widest uppercase",
                accent === "primary" ? "text-primary" : "text-destructive",
              )}
            >
              {title}
            </H3>
            <Activity name={"subtitle"} mode={isWinner ? "hidden" : "visible"}>
              <Muted className="text-sm text-muted-foreground whitespace-pre-line tracking-wide leading-relaxed">
                {subtitle}
              </Muted>
            </Activity>
          </div>

          <Card className="w-full max-w-sm rounded-4xl bg-card/80 p-6 shadow-[0_0_30px_-18px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between gap-4">
              <MatchResultPlayerBadge
                name={currentUser.name}
                avatar={currentUser.avatar}
                isWinner={isWinner}
                accent={currentAccent}
                label="You"
              />
              <div className="grid place-items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
                <Small className="text-[10px]">Final</Small>
                <Small className="text-[10px]">Result</Small>
              </div>
              <MatchResultPlayerBadge
                name={opponentUser.name}
                avatar={opponentUser.avatar}
                isWinner={!isWinner}
                accent={opponentAccent}
                label="Opponent"
              />
            </div>
          </Card>

          <div className="grid w-full gap-3">
            <Button
              className={cn(
                "h-12 rounded-full text-sm font-semibold uppercase tracking-widest",
                isWinner
                  ? "bg-primary text-primary-foreground"
                  : "bg-destructive text-destructive-foreground",
              )}
              onClick={handleNavigate}
            >
              <RotateCcw className="size-4" />
              {primaryLabel}
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-full text-sm tracking-widest"
              onClick={handleNavigate}
            >
              <Home className="size-4" />
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
