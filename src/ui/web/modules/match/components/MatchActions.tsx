import { Activity, useCallback, useState } from "react";

import { Dot, Flag } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import { abandonGameUseCase } from "@/application/games/abandonGameUseCase";
import type { GameId, MatchState } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { Muted } from "@/ui/web/components/Typography";
import { Badge } from "@/ui/web/components/ui/badge";
import { Button } from "@/ui/web/components/ui/button";
import { cn } from "@/ui/web/lib/utils";

type MatchActionsProps = {
  gameId: GameId;
  match: MatchState | null;
  variant?: "default" | "hud";
  className?: string;
};

export const MatchActions = ({
  gameId,
  match,
  variant = "default",
  className,
}: MatchActionsProps) => {
  const isHud = variant === "hud";
  const navigate = useNavigate();
  const [isAbandoning, setIsAbandoning] = useState(false);
  const showRoundCounter = Boolean(match && match.format !== "single");
  const bestOf = match ? match.targetWins * 2 - 1 : 1;

  const handleAbandonMatch = useCallback(async () => {
    if (isAbandoning) {
      return;
    }
    setIsAbandoning(true);
    try {
      await abandonGameUseCase(gameRepository, { gameId });
      await navigate({ to: "/play" });
    } finally {
      setIsAbandoning(false);
    }
  }, [gameId, isAbandoning, navigate]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div
        className={cn(
          "flex flex-col gap-3",
          !isHud && "md:flex-row md:justify-center",
        )}
      >
        <Button
          type="button"
          variant="outline"
          className="h-12 text-sm font-semibold"
          onClick={handleAbandonMatch}
          disabled={!gameId || isAbandoning}
        >
          <Flag className="size-4 text-destructive" />
          <span className="text-destructive">
            {isAbandoning ? "Abandoning..." : "Abandon Match"}
          </span>
        </Button>
      </div>
      <Activity
        name={"round-counter"}
        mode={showRoundCounter ? "visible" : "hidden"}
      >
        <div className={"flex justify-center"}>
          <Badge variant={"secondary"} className={"text-muted-foreground"}>
            <Muted className="text-xs">Round {match?.roundIndex ?? 1}</Muted>
            <Dot />
            <Muted className="text-xs">Best of {bestOf}</Muted>
          </Badge>
        </div>
      </Activity>
    </div>
  );
};
