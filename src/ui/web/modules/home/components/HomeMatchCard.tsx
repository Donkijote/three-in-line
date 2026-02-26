import { ChevronRight } from "lucide-react";

import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import { useCurrentUser, useUserById } from "@/ui/shared/user/hooks/useUser";
import { H6, Muted, Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { resolvePlayerLabel } from "@/ui/web/lib/user";
import { cn, getFallbackInitials } from "@/ui/web/lib/utils";
import type {
  HomeMatch,
  HomeMatchStatus,
} from "@/ui/web/modules/home/components/home.types";

const statusStyles: Record<
  HomeMatchStatus,
  { badge: string; ring: string; text: string; rail: string }
> = {
  victory: {
    badge: "bg-primary/18 text-primary",
    ring: "ring-primary/70",
    text: "Victory",
    rail: "bg-primary/90",
  },
  defeat: {
    badge: "bg-destructive/20 text-destructive",
    ring: "ring-destructive/70",
    text: "Defeat",
    rail: "bg-destructive/90",
  },
  stalemate: {
    badge: "bg-muted text-muted-foreground",
    ring: "ring-muted-foreground/60",
    text: "Stalemate",
    rail: "bg-muted-foreground/90",
  },
};

export const HomeMatchCard = ({
  status,
  subtitle,
  time,
  opponentUserId,
}: HomeMatch) => {
  const statusStyle = statusStyles[status];
  const currentUser = useCurrentUser();
  const opponentUser = useUserById(opponentUserId);

  const currentName = resolvePlayerLabel(currentUser ?? {}, "You");
  const opponentName = resolvePlayerLabel(opponentUser ?? {}, "Opponent");
  const currentInitials = getFallbackInitials({
    name: currentUser?.name,
    username: currentUser?.username,
    email: currentUser?.email,
  });
  const opponentInitials = getFallbackInitials({
    name: opponentUser?.name,
    username: opponentUser?.username,
    email: opponentUser?.email,
  });
  const currentAvatar = resolveAvatarSrc(currentUser?.avatar);
  const opponentAvatar = resolveAvatarSrc(opponentUser?.avatar);

  return (
    <Card className="group relative gap-0 overflow-hidden rounded-4xl py-0 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] transition-colors hover:bg-card/80 dark:shadow-[0_20px_48px_-36px_rgba(0,0,0,0.75)]">
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-1", statusStyle.rail)}
      />
      <CardContent className="flex items-center px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Small
              variant="label"
              className={cn(
                "rounded-full px-2 py-1 text-[9px] leading-none",
                statusStyle.badge,
              )}
            >
              {statusStyle.text}
            </Small>
            <Small className="text-[10px] font-medium text-muted-foreground">
              {time}
            </Small>
          </div>
          <H6 className="truncate text-base">vs {opponentName}</H6>
          <Muted className="mt-0 truncate text-xs text-muted-foreground">
            {subtitle}
          </Muted>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex -space-x-2">
              <Avatar
                size="lg"
                className={cn(
                  "border border-background bg-card text-foreground ring-2",
                  statusStyle.ring,
                )}
              >
                <AvatarImage src={currentAvatar} alt={currentName} />
                <AvatarFallback className="bg-card font-semibold text-foreground">
                  {currentInitials}
                </AvatarFallback>
              </Avatar>
              <Avatar
                size="lg"
                className="border border-background bg-secondary text-foreground ring-2 ring-border/80"
              >
                <AvatarImage src={opponentAvatar} alt={opponentName} />
                <AvatarFallback className="bg-secondary font-semibold text-foreground">
                  {opponentInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-background px-1.5 py-0.5 text-[8px] font-semibold uppercase text-muted-foreground">
              vs
            </span>
          </div>
          <ChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};
