import { ChevronRight } from "lucide-react";

import { useHomeMatchCard } from "@/ui/shared/home/hooks/useHomeMatchCard";
import { homeMatchStatusStyles } from "@/ui/shared/home/style/homeMatchStatusStyles";
import type { HomeMatch } from "@/ui/shared/home/types/types";
import { H6, Muted, Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

export const HomeMatchCard = ({
  status,
  subtitle,
  time,
  opponentUserId,
}: HomeMatch) => {
  const statusStyle = homeMatchStatusStyles[status];
  const {
    currentAvatar,
    currentInitials,
    currentName,
    opponentAvatar,
    opponentInitials,
    opponentName,
  } = useHomeMatchCard(opponentUserId);

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
                  statusStyle.web.emphasis,
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
