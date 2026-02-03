import { Activity } from "react";

import { Flag, HeartCrack, Trophy, WifiOff } from "lucide-react";

import { H3, Muted } from "@/ui/web/components/Typography";
import { cn } from "@/ui/web/lib/utils";

import type { ResultAccent, ResultIcon } from "./MatchResultOverlay.types";

type MatchResultHeaderProps = {
  title: string;
  subtitle?: string;
  accent: ResultAccent;
  icon: ResultIcon;
};

export const MatchResultHeader = ({
  title,
  subtitle,
  accent,
  icon,
}: MatchResultHeaderProps) => {
  return (
    <div className="grid gap-20">
      <MatchResultHeaderIcon accent={accent} icon={icon} />
      <div className={"flex flex-col gap-6"}>
        <H3
          className={cn("font-semibold tracking-widest uppercase", {
            "text-5xl text-primary": accent === "primary",
            "text-4xl text-destructive": accent === "destructive",
          })}
        >
          {title}
        </H3>
        <Activity name={"subtitle"} mode={subtitle ? "visible" : "hidden"}>
          <Muted className="text-sm text-muted-foreground whitespace-pre-line tracking-wide leading-relaxed">
            {subtitle}
          </Muted>
        </Activity>
      </div>
    </div>
  );
};

type MatchResultHeaderIconProps = {
  accent: ResultAccent;
  icon: ResultIcon;
};

const MatchResultHeaderIcon = ({
  accent,
  icon,
}: MatchResultHeaderIconProps) => {
  if (icon === "wifi") {
    return (
      <div className="grid place-items-center">
        <WifiOff className="size-20 text-amber-500" />
      </div>
    );
  }

  if (icon === "flag") {
    return (
      <div className="grid place-items-center text-muted-foreground">
        <Flag className="size-20" />
      </div>
    );
  }

  const Icon = icon === "trophy" ? Trophy : HeartCrack;

  return (
    <div
      className={cn("grid place-items-center", {
        "text-primary drop-shadow-[0_0_18px_rgba(16,185,129,0.6)]":
          accent === "primary",
        "text-destructive": accent === "destructive",
      })}
    >
      <Icon className="size-20" />
    </div>
  );
};
