import { HOME_SCREEN_COPY } from "@/ui/shared/home/constants/constants";
import { useHomeMatches } from "@/ui/shared/home/hooks/useHomeMatches";
import type { HomeMatch } from "@/ui/shared/home/types/types";

type HomeMatchSection = {
  emptyMessage?: string;
  id: string;
  matches: HomeMatch[];
  title: string;
};

export const useHomeMatchSections = (
  endedGames: Parameters<typeof useHomeMatches>[0],
) => {
  const { previousWeekMatches, recentMatches } = useHomeMatches(endedGames);

  const sections: HomeMatchSection[] = [
    {
      emptyMessage: HOME_SCREEN_COPY.noRecentMatches,
      id: "recent",
      matches: recentMatches,
      title: HOME_SCREEN_COPY.recentMatchesLabel,
    },
    {
      id: "previous-week",
      matches: previousWeekMatches,
      title: HOME_SCREEN_COPY.previousWeekLabel,
    },
  ];

  return sections;
};
