import { Flame, Swords, Trophy } from "lucide-react";

import {
  type HomeStatIconName,
  homeStatStyles,
} from "@/ui/shared/home/style/homeStatStyles";
import type { HomeStat } from "@/ui/shared/home/types/types";
import { H4, Small } from "@/ui/web/components/Typography";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

const iconByName: Record<HomeStatIconName, typeof Trophy> = {
  flame: Flame,
  swords: Swords,
  trophy: Trophy,
} as const;

export const HomeStatCard = ({ label, value, accent }: HomeStat) => {
  const statStyle = homeStatStyles[accent];
  const Icon = iconByName[statStyle.icon];

  return (
    <Card
      className={cn(
        "min-w-34 flex-1 gap-0 rounded-3xl py-0 backdrop-blur-xs",
        "shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] dark:shadow-[0_20px_48px_-36px_rgba(0,0,0,0.8)]",
      )}
    >
      <CardContent className="px-4 py-3">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "grid size-5 place-items-center rounded-full",
              statStyle.iconContainerClassName,
              statStyle.iconClassName,
            )}
          >
            <Icon className="size-3" />
          </span>
          <Small variant="label" className="text-[10px] text-muted-foreground">
            {label}
          </Small>
        </div>

        <H4 className="text-3xl leading-none">{value}</H4>
      </CardContent>
    </Card>
  );
};
