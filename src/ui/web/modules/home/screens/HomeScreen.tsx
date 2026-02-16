import { Activity } from "react";

import { ScrollText } from "lucide-react";

import type { Game, PlayerSlot } from "@/domain/entities/Game";
import { useRecentGamesQuery } from "@/infrastructure/convex/GameApi";
import { Header } from "@/ui/web/components/Header";
import { P } from "@/ui/web/components/Typography";
import { useCurrentUser } from "@/ui/web/hooks/useUser";
import { HomeMatchCard } from "@/ui/web/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/web/modules/home/components/HomeSectionLabel";
import { HomeStats } from "@/ui/web/modules/home/components/HomeStats";
import type { HomeMatch } from "@/ui/web/modules/home/components/home.types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const toOutcomeStatus = (game: Game, viewerSlot: PlayerSlot | null) => {
  if (game.endedReason === "draw" || game.winner === null || !viewerSlot) {
    return "stalemate" as const;
  }
  return game.winner === viewerSlot ? "victory" : "defeat";
};

const toOpponentName = (game: Game, currentUserId: string | undefined) => {
  if (!currentUserId) {
    return "Opponent";
  }
  const opponentId =
    game.p1UserId === currentUserId ? game.p2UserId : game.p1UserId;
  if (!opponentId) {
    return "Open Slot";
  }
  return `Player ${opponentId.slice(-4).toUpperCase()}`;
};

const toOpponentInitials = (name: string) => {
  const chunks = name.split(" ").filter(Boolean);
  if (chunks.length === 1) {
    return chunks[0].slice(0, 2).toUpperCase();
  }
  return `${chunks[0][0] ?? ""}${chunks[1][0] ?? ""}`.toUpperCase();
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

export function HomeScreen() {
  const currentUser = useCurrentUser();
  const recentGames = useRecentGamesQuery();

  const endedGames = recentGames ?? [];
  const currentUserId = currentUser?.id;
  const now = Date.now();
  const recentMatches: HomeMatch[] = [];
  const previousWeekMatches: HomeMatch[] = [];

  for (const game of endedGames) {
    const viewerSlot = resolveViewerSlot(game, currentUserId);
    const status = toOutcomeStatus(game, viewerSlot);
    const opponentName = toOpponentName(game, currentUserId);
    const match: HomeMatch = {
      id: game.id,
      status,
      time: toMatchTime(game.updatedTime),
      title: opponentName,
      subtitle: toModeLabel(game),
      opponentInitials: toOpponentInitials(opponentName),
    };

    if (now - game.updatedTime <= WEEK_MS) {
      recentMatches.push(match);
      continue;
    }
    previousWeekMatches.push(match);
  }

  return (
    <section className="mx-auto flex max-w-[calc(100svw-2rem)] w-full h-full md:max-w-xl flex-col gap-10 pb-12">
      <Header title="Match History" eyebrow="Mission Logs" />

      <HomeStats endedGames={endedGames} />

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

      <div className={"flex flex-col items-center justify-center gap-2"}>
        <div className="flex size-14 items-center justify-center rounded-full border bg-card">
          <ScrollText className="size-8 text-foreground/80" />
        </div>
        <P className="text-md font-semibold text-muted-foreground mt-0!">
          No more logs found
        </P>
      </div>
    </section>
  );
}
