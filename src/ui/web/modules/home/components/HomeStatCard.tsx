import { Flame, Swords, Trophy } from "lucide-react";

import { H4, Small } from "@/ui/web/components/Typography";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";
import type { HomeStat } from "@/ui/web/modules/home/components/home.types";

const iconByAccent = {
  primary: Trophy,
  opponent: Swords,
  warning: Flame,
} as const;

export const HomeStatCard = ({ label, value, accent }: HomeStat) => {
  const Icon = iconByAccent[accent];

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
              accent === "primary" && "bg-primary/15 text-primary",
              accent === "opponent" && "bg-opponent/15 text-opponent",
              accent === "warning" && "bg-destructive/15 text-destructive",
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
