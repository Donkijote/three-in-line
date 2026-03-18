import { View } from "react-native";

import { H6, Muted, Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Text } from "@/ui/mobile/components/ui/text";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { cn } from "@/ui/mobile/lib/utils";

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
  const showTurnTimer = Boolean(turnTimer?.isActive);
  const accentClasses =
    accent === "opponent"
      ? {
          badge: "bg-opponent text-opponent-foreground",
          border: "border-opponent/50",
          symbol: "text-opponent",
          timer: "bg-opponent",
          shadow: "shadow-[0_0_10px_-8px_rgba(84,126,234,0.28)]",
        }
      : {
          badge: "bg-primary text-primary-foreground",
          border: "border-primary/50",
          symbol: "text-primary",
          timer: "bg-primary",
          shadow: "shadow-[0_0_10px_-8px_rgba(61,168,105,0.28)]",
        };
  const timerProgress = Math.max(0, Math.min(turnTimer?.progress ?? 0, 1));
  const isUrgent = showTurnTimer && timerProgress <= 0.1;
  const badgeClassName = isUrgent
    ? "bg-destructive text-destructive-foreground"
    : accentClasses.badge;

  return (
    <CardSlot
      accentClasses={accentClasses}
      avatar={avatar}
      badgeClassName={badgeClassName}
      isTurn={isTurn}
      name={name}
      showTurnTimer={showTurnTimer}
      showWins={showWins}
      symbol={symbol}
      timerProgress={timerProgress}
      wins={wins}
      isUrgent={isUrgent}
    />
  );
};

type CardSlotProps = {
  accentClasses: {
    badge: string;
    border: string;
    symbol: string;
    timer: string;
    shadow: string;
  };
  avatar?: string;
  badgeClassName: string;
  isTurn: boolean;
  isUrgent: boolean;
  name: string;
  showTurnTimer: boolean;
  showWins: boolean;
  symbol: "X" | "O";
  timerProgress: number;
  wins: number;
};

const CardSlot = ({
  accentClasses,
  avatar,
  badgeClassName,
  isTurn,
  isUrgent,
  name,
  showTurnTimer,
  showWins,
  symbol,
  timerProgress,
  wins,
}: CardSlotProps) => {
  return (
    <View className="relative flex-1 pt-2.5">
      <Visibility visible={isTurn}>
        <TurnBadge badgeClassName={badgeClassName} />
      </Visibility>
      <Card
        className={cn(
          "flex-1 gap-0 rounded-3xl border-border/60 px-0 py-0 shadow-none",
          {
            "opacity-70": !isTurn,
            [accentClasses.border]: isTurn,
            [accentClasses.shadow]: isTurn,
          },
        )}
      >
        <Visibility visible={showTurnTimer}>
          <TimerBar
            timerClassName={accentClasses.timer}
            isUrgent={isUrgent}
            progress={timerProgress}
          />
        </Visibility>
        <CardContent className="items-center gap-3.5 px-4 pb-4 pt-5">
          <Avatar
            alt={name}
            className={cn("size-20 border-2 bg-card", {
              [accentClasses.border]: isTurn,
              "border-border/60": !isTurn,
            })}
          >
            <Visibility visible={Boolean(avatar)}>
              {avatar ? <AvatarImage source={{ uri: avatar }} /> : null}
            </Visibility>
            <AvatarFallback className="bg-secondary">
              <H6>{name.slice(0, 1)}</H6>
            </AvatarFallback>
          </Avatar>
          <View className="items-center gap-1">
            <View className="flex-row items-center gap-2">
              <H6 className="text-center text-sm">{name}</H6>
              <Text
                className={cn("text-sm font-semibold", accentClasses.symbol)}
              >
                ({symbol})
              </Text>
            </View>
            <Visibility visible={showWins}>
              <Muted className="mt-0 text-xs text-muted-foreground">
                Wins: {wins}
              </Muted>
            </Visibility>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

const TurnBadge = ({ badgeClassName }: { badgeClassName: string }) => {
  return (
    <View className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
      <Small
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]",
          badgeClassName,
        )}
      >
        Turn
      </Small>
    </View>
  );
};

const TimerBar = ({
  timerClassName,
  isUrgent,
  progress,
}: {
  timerClassName: string;
  isUrgent: boolean;
  progress: number;
}) => {
  return (
    <View className="overflow-hidden rounded-t-3xl">
      <View className="h-1 w-full bg-secondary/80">
        <View
          className={cn("h-full", {
            "bg-destructive": isUrgent,
            [timerClassName]: !isUrgent,
          })}
          style={{ width: `${Math.max(progress * 100, 0)}%` }}
        />
      </View>
    </View>
  );
};
