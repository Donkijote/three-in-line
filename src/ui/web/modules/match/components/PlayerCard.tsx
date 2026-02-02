import type { CSSProperties } from "react";
import { Activity } from "react";

import { H6, Muted, Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

type PlayerCardProps = {
  name: string;
  symbol: "X" | "O";
  wins: number;
  showWins: boolean;
  isTurn: boolean;
  avatar?: string;
  accent: "primary" | "opponent";
  turnTimer?: {
    isActive: boolean;
    progress: number;
  };
};

export const PlayerCard = ({
  name,
  symbol,
  wins,
  showWins,
  isTurn,
  avatar,
  accent,
  turnTimer,
}: PlayerCardProps) => {
  const accentClasses =
    accent === "opponent"
      ? {
          badge: "bg-opponent text-opponent-foreground",
          ring: "ring-opponent/60",
          avatarRing: "ring-opponent",
          symbol: "text-opponent",
          shadow: "shadow-[0_0_18px_-6px_var(--opponent)]",
        }
      : {
          badge: "bg-primary text-primary-foreground",
          ring: "ring-primary/60",
          avatarRing: "ring-primary",
          symbol: "text-primary",
          shadow: "shadow-[0_0_18px_-6px_var(--chart-1)]",
        };

  const timerProgress = Math.max(0, Math.min(turnTimer?.progress ?? 0, 1));
  const showTurnTimer = Boolean(turnTimer?.isActive);
  const isUrgent = showTurnTimer && timerProgress <= 0.1;
  const urgentAccentClasses = isUrgent
    ? {
        badge: "bg-destructive text-destructive-foreground",
        ring: "ring-destructive/60",
        avatarRing: "ring-destructive",
        symbol: "text-destructive",
        shadow: "shadow-[0_0_18px_-6px_var(--destructive)]",
      }
    : null;
  const activeAccentClasses = urgentAccentClasses ?? accentClasses;
  const timerColors = resolveTimerColors({ accent, isUrgent });
  const timerStyle: CSSProperties | undefined = showTurnTimer
    ? ({
        "--timer-color": timerColors.stroke,
        "--timer-shadow-color": timerColors.shadow,
      } as CSSProperties)
    : undefined;
  const timerCircumference = 2 * Math.PI * 35;

  return (
    <div className={"relative"}>
      <Activity name={"turn-label"} mode={isTurn ? "visible" : "hidden"}>
        <Small
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
            activeAccentClasses.badge,
          )}
        >
          Turn
        </Small>
      </Activity>

      <Card
        className={cn(
          "transition pt-5 pb-3",
          {
            "ring-2 relative": isTurn,
            "opacity-60": !isTurn,
          },
          isTurn && activeAccentClasses.ring,
          isTurn && activeAccentClasses.shadow,
        )}
      >
        <CardContent className="flex flex-col items-center gap-2 pt-1">
          <Activity
            name={"turn-timer"}
            mode={showTurnTimer ? "visible" : "hidden"}
          >
            <svg
              className="absolute inset-0 top-3.5 left-1/2 -translate-x-1/2 size-21 -rotate-90 text-border z-20 filter-[drop-shadow(0_0_18px_var(--timer-shadow-color))]"
              viewBox="0 0 80 80"
              aria-hidden="true"
              style={timerStyle}
            >
              <circle
                cx="50%"
                cy="50%"
                r="35.5"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="35.1"
                stroke="var(--timer-color)"
                strokeWidth="4"
                strokeDasharray={timerCircumference}
                strokeDashoffset={timerCircumference * (1 - timerProgress)}
                strokeLinecap="round"
                fill="transparent"
                className={"transition-[stroke-dashoffset]"}
              />
            </svg>
          </Activity>
          <Avatar
            size={"lg"}
            className={cn(
              "relative size-16!",
              {
                "ring-3 ring-offset-3 ring-offset-card":
                  isTurn && !showTurnTimer,
                grayscale: !isTurn,
              },
              isTurn && activeAccentClasses.avatarRing,
            )}
          >
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <H6 className="text-base font-semibold">{name}</H6>
              <H6
                className={cn("text-muted-foreground", {
                  [activeAccentClasses.symbol]: isTurn,
                })}
              >
                ({symbol})
              </H6>
            </div>
            <Activity
              name={"current-wins"}
              mode={showWins ? "visible" : "hidden"}
            >
              <Muted
                className={cn("text-xs text-muted-foreground/50", {
                  "text-muted-foreground/70": isTurn,
                })}
              >
                Wins: {wins}
              </Muted>
            </Activity>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const resolveTimerColors = ({
  accent,
  isUrgent,
}: {
  accent: "primary" | "opponent";
  isUrgent: boolean;
}) => {
  if (isUrgent) {
    return {
      stroke: "var(--color-destructive)",
      shadow: "var(--destructive)",
    };
  }
  if (accent === "opponent") {
    return {
      stroke: "var(--color-opponent)",
      shadow: "var(--opponent)",
    };
  }
  return {
    stroke: "var(--color-primary)",
    shadow: "var(--chart-1)",
  };
};
