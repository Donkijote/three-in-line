import { Activity } from "react";

import type { Game, PlayerSlot } from "@/domain/entities/Game";
import { useCurrentUser } from "@/ui/shared/user/hooks/useUser";
import { P } from "@/ui/web/components/Typography";
import { HomeMatchCard } from "@/ui/web/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/web/modules/home/components/HomeSectionLabel";
import type { HomeMatch } from "@/ui/web/modules/home/components/home.types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const toOutcomeStatus = (game: Game, viewerSlot: PlayerSlot | null) => {
  if (game.endedReason === "draw" || game.winner === null || !viewerSlot) {
    return "stalemate" as const;
  }
  return game.winner === viewerSlot ? "victory" : "defeat";
};

const toModeLabel = (game: Game) => {
  if (game.turnDurationMs !== null) {
    return "Timed Challenge";
  }
  if (game.match.format === "bo3") {
    return "Best of Three";
  }
  if (game.match.format === "bo5") {
    return "Best of Five";
  }
  if (game.gridSize > 3) {
    return "Tactical Grid Mode";
  }
  return "Classic Mode";
};

const toMatchTime = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);
};

const resolveViewerSlot = (
  game: Game,
  currentUserId: string | undefined,
): PlayerSlot | null => {
  if (!currentUserId) {
    return null;
  }
  if (game.p1UserId === currentUserId) {
    return "P1";
  }
  return "P2";
};

const resolveOpponentUserId = (
  game: Game,
  currentUserId: string | undefined,
) => {
  if (!currentUserId) {
    return game.p2UserId ?? game.p1UserId;
  }
  return game.p1UserId === currentUserId ? game.p2UserId : game.p1UserId;
};

type HomeMatchesProps = {
  endedGames: Game[];
};

export const HomeMatches = ({ endedGames }: HomeMatchesProps) => {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const now = Date.now();
  const recentMatches: HomeMatch[] = [];
  const previousWeekMatches: HomeMatch[] = [];

  for (const game of endedGames) {
    const viewerSlot = resolveViewerSlot(game, currentUserId);
    const status = toOutcomeStatus(game, viewerSlot);
    const match: HomeMatch = {
      id: game.id,
      status,
      time: toMatchTime(game.updatedTime),
      opponentUserId: resolveOpponentUserId(game, currentUserId),
      subtitle: toModeLabel(game),
    };

    if (now - game.updatedTime <= WEEK_MS) {
      recentMatches.push(match);
      continue;
    }
    previousWeekMatches.push(match);
  }

  return (
    <div className="flex flex-col gap-5 pr-2">
      <HomeSectionLabel text="Recent Matches" />
      <div className="space-y-5">
        {recentMatches.map((match) => (
          <HomeMatchCard key={match.id} {...match} />
        ))}
        <Activity
          name={"recent-empty"}
          mode={recentMatches.length === 0 ? "visible" : "hidden"}
        >
          <P className="mt-0! text-sm font-semibold text-muted-foreground">
            No recent matches in the last 7 days.
          </P>
        </Activity>
      </div>

      <HomeSectionLabel text="Previous Week" />
      <div className="space-y-5">
        {previousWeekMatches.map((match) => (
          <HomeMatchCard key={match.id} {...match} />
        ))}
      </div>
    </div>
  );
};
