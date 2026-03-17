import type { LucideIcon } from "lucide-react";
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

import {
  PLAY_MODES,
  PLAY_SCREEN_CONTENT,
  type PlayMode,
} from "@/ui/shared/play/constants/modes";
import { useCreateGame } from "@/ui/shared/play/hooks/useCreateGame";
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

const modeIcons: Record<PlayMode["icon"], LucideIcon> = {
  hash: Hash,
  trophy: Trophy,
  medal: Medal,
  clock: Clock,
  "grid-4": Grid2x2,
  "grid-6": Grid3x3,
};

const modeStyles: Record<PlayMode["tone"], { accent: string; bg: string }> = {
  emerald: {
    accent: "text-emerald-500",
    bg: "bg-emerald-500/15",
  },
  yellow: {
    accent: "text-yellow-500",
    bg: "bg-yellow-500/15",
  },
  fuchsia: {
    accent: "text-fuchsia-500",
    bg: "bg-fuchsia-500/15",
  },
  orange: {
    accent: "text-orange-500",
    bg: "bg-orange-500/15",
  },
  sky: {
    accent: "text-sky-500",
    bg: "bg-sky-500/15",
  },
  violet: {
    accent: "text-purple-500",
    bg: "bg-purple-500/15",
  },
};

export const PlayScreen = () => {
  const navigate = useNavigate();
  const { createGame, isCreating } = useCreateGame();

  const handleSelectMode = async (mode: PlayMode) => {
    const gameId = await createGame(mode.config);

    if (!gameId) {
      return;
    }

    await navigate({
      to: "/match",
      search: { gameId },
    });
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-8 md:gap-20 pb-12 h-full">
      <Header
        title={PLAY_SCREEN_CONTENT.title}
        eyebrow={PLAY_SCREEN_CONTENT.eyebrow}
      />
      <div className="flex flex-col gap-2 text-center">
        <H3 className="text-xl">{PLAY_SCREEN_CONTENT.heading}</H3>
        <Muted className="text-sm text-muted-foreground">
          {PLAY_SCREEN_CONTENT.description}
        </Muted>
      </div>
      <ItemGroup className="gap-4 md:grid md:grid-cols-2">
        {PLAY_MODES.map((mode) => {
          const Icon = modeIcons[mode.icon];
          const styles = modeStyles[mode.tone];

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
                  className={cn("size-10 rounded-xl", styles.accent, styles.bg)}
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
