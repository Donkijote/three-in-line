import { ScrollText } from "lucide-react";

import { Header } from "@/ui/web/components/Header";
import { P } from "@/ui/web/components/Typography";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { HomeMatchCard } from "@/ui/web/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/web/modules/home/components/HomeSectionLabel";
import { HomeStatCard } from "@/ui/web/modules/home/components/HomeStatCard";
import type {
  HomeMatch,
  HomeStat,
} from "@/ui/web/modules/home/components/home.types";

const homeStats: HomeStat[] = [
  { id: "wins", label: "Wins", value: "42", accent: "primary" },
  { id: "win-rate", label: "Win Rate", value: "68%", accent: "opponent" },
  { id: "streak", label: "Streak", value: "5", accent: "warning" },
];

const recentMatches: HomeMatch[] = [
  {
    id: "recent-1",
    status: "victory",
    time: "14:02",
    title: "CPU (Hard)",
    subtitle: "Tactical Grid Mode",
    opponentInitials: "CP",
  },
  {
    id: "recent-2",
    status: "defeat",
    time: "09:15",
    title: "Cyber_Samurai",
    subtitle: "Classic Mode",
    opponentInitials: "CS",
  },
  {
    id: "recent-3",
    status: "stalemate",
    time: "Oct 22 · 18:45",
    title: "CPU (Medium)",
    subtitle: "Timed Challenge",
    opponentInitials: "CP",
  },
];

const previousWeekMatches: HomeMatch[] = [
  {
    id: "week-1",
    status: "victory",
    time: "Oct 18",
    title: "Player_Two",
    subtitle: "Tactical Grid Mode",
    opponentInitials: "PT",
  },
];

export function HomeScreen() {
  return (
    <section className="mx-auto flex max-w-[calc(100svw-2rem)] w-full h-full md:max-w-xl flex-col gap-10 pb-12">
      <Header title="Match History" eyebrow="Mission Logs" />

      <ScrollArea>
        <div className="flex gap-4 overflow-x-auto py-3">
          {homeStats.map((stat) => (
            <div className="snap-center" key={stat.id}>
              <HomeStatCard {...stat} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col gap-5 pr-2">
        <HomeSectionLabel text="Recent Matches" />
        <div className="space-y-5">
          {recentMatches.map((match) => (
            <HomeMatchCard key={match.id} {...match} />
          ))}
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
