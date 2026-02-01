import { useCallback, useState } from "react";

import {
  ChevronRight,
  Clock,
  Grid2x2,
  Grid3x3,
  Hash,
  Medal,
  Trophy,
} from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { Header } from "@/ui/web/components/Header";
import { H3, H6, Muted } from "@/ui/web/components/Typography";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/ui/web/components/ui/item";
import { cn } from "@/ui/web/lib/utils";

const modes = [
  {
    id: "classic",
    title: "Classic Mode",
    description: "Standard rules. The original game.",
    icon: Hash,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/15",
    config: { gridSize: 3, winLength: 3, matchFormat: "single" },
  },
  {
    id: "best-of-three",
    title: "Best of Three",
    description: "First to 2 wins takes the crown.",
    icon: Trophy,
    accent: "text-yellow-500",
    bg: "bg-yellow-500/15",
    config: { gridSize: 3, winLength: 3, matchFormat: "bo3" },
  },
  {
    id: "best-of-five",
    title: "Best of Five",
    description: "An extended battle for dominance.",
    icon: Medal,
    accent: "text-fuchsia-500",
    bg: "bg-fuchsia-500/15",
    config: { gridSize: 3, winLength: 3, matchFormat: "bo5" },
  },
  {
    id: "time-challenge",
    title: "Time Challenge",
    description: "Make your move before time runs out.",
    icon: Clock,
    accent: "text-orange-500",
    bg: "bg-orange-500/15",
    config: {
      gridSize: 3,
      winLength: 3,
      matchFormat: "single",
      isTimed: true,
    },
  },
  {
    id: "grid-4x4",
    title: "4x4 Grid",
    description: "Connect 4 to win on a bigger board.",
    icon: Grid2x2,
    accent: "text-sky-500",
    bg: "bg-sky-500/15",
    config: { gridSize: 4, winLength: 3, matchFormat: "single" },
  },
  {
    id: "grid-6x6",
    title: "6x6 Grid",
    description: "Complex strategy on a massive field.",
    icon: Grid3x3,
    accent: "text-purple-500",
    bg: "bg-purple-500/15",
    config: { gridSize: 6, winLength: 3, matchFormat: "single" },
  },
] as const;

export const PlayScreen = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectMode = useCallback(
    async (mode: (typeof modes)[number]) => {
      if (isCreating) {
        return;
      }
      setIsCreating(true);
      try {
        const gameId = await findOrCreateGameUseCase(
          gameRepository,
          mode.config,
        );
        await navigate({
          to: "/match",
          search: { gameId },
        });
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating, navigate],
  );

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-8 md:gap-20 pb-12 h-full">
      <Header title="Select Mode" eyebrow="New Game" />
      <div className="flex flex-col gap-2 text-center">
        <H3 className="text-xl">Choose your challenge</H3>
        <Muted className="text-sm text-muted-foreground">
          Pick a mode to jump into a match with unique rules and stakes.
        </Muted>
      </div>
      <ItemGroup className="gap-4 md:grid md:grid-cols-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Item
              key={mode.id}
              asChild
              variant="outline"
              className={
                "bg-card hover:bg-card/70 cursor-pointer min-h-20 md:min-h-38 md:flex-col md:items-center md:gap-0 rounded-4xl disabled:cursor-not-allowed disabled:opacity-70"
              }
            >
              <button
                type="button"
                onClick={() => handleSelectMode(mode)}
                disabled={isCreating}
              >
                <ItemMedia
                  variant="icon"
                  className={cn("size-10 rounded-xl", mode.accent, mode.bg)}
                >
                  <Icon className="size-4" />
                </ItemMedia>
                <ItemContent className={"md:text-center md:justify-center"}>
                  <H6 className="text-sm font-semibold">{mode.title}</H6>
                  <Muted className="text-xs text-muted-foreground">
                    {mode.description}
                  </Muted>
                </ItemContent>
                <ItemActions className={"md:hidden"}>
                  <span
                    className={
                      "grid size-8 place-items-center rounded-full bg-secondary/70 text-muted-foreground transition-colors"
                    }
                  >
                    <ChevronRight className="size-4" />
                  </span>
                </ItemActions>
              </button>
            </Item>
          );
        })}
      </ItemGroup>
    </section>
  );
};
