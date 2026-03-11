import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";

import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import { H6, Muted, Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { cn } from "@/ui/mobile/lib/utils";
import type { HomeMatch, HomeMatchStatus } from "@/ui/shared/home/types";
import { useCurrentUser, useUserById } from "@/ui/shared/user/hooks/useUser";
import { getFallbackInitials } from "@/ui/shared/user/initials";
import { resolvePlayerLabel } from "@/ui/shared/user/resolvePlayerLabel";

const statusStyles: Record<
  HomeMatchStatus,
  { badge: string; border: string; rail: string; text: string }
> = {
  victory: {
    badge: "bg-primary/20 text-primary",
    border: "border-primary/70",
    rail: "bg-primary",
    text: "Victory",
  },
  defeat: {
    badge: "bg-destructive/20 text-destructive",
    border: "border-destructive/70",
    rail: "bg-destructive",
    text: "Defeat",
  },
  stalemate: {
    badge: "bg-muted text-muted-foreground",
    border: "border-border",
    rail: "bg-muted-foreground",
    text: "Stalemate",
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
    <Card className="relative gap-0 overflow-hidden rounded-3xl border-border/60 py-0 shadow-sm shadow-black/5">
      <View
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-1", statusStyle.rail)}
      />
      <CardContent className="flex-row items-center px-4 py-4">
        <View className="min-w-0 flex-1">
          <View className="mb-2 flex-row items-center gap-2">
            <Small
              variant="label"
              className={cn(
                "rounded-full px-2 py-1 text-[9px]",
                statusStyle.badge,
              )}
            >
              {statusStyle.text}
            </Small>
            <Small className="text-[10px] font-medium text-muted-foreground">
              {time}
            </Small>
          </View>
          <H6 className="text-base text-foreground" numberOfLines={1}>
            vs {opponentName}
          </H6>
          <Muted
            className="mt-0 text-xs text-muted-foreground"
            numberOfLines={1}
          >
            {subtitle}
          </Muted>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="relative">
            <View className="flex-row">
              <Avatar
                alt={currentName}
                className={cn("size-11 border-2 bg-card", statusStyle.border)}
              >
                {currentAvatar ? (
                  <AvatarImage source={{ uri: currentAvatar }} />
                ) : null}
                <AvatarFallback className="bg-card">
                  <Small className="text-sm font-semibold text-foreground">
                    {currentInitials}
                  </Small>
                </AvatarFallback>
              </Avatar>
              <View className="-ml-3">
                <Avatar
                  alt={opponentName}
                  className="size-11 border-2 border-border bg-secondary"
                >
                  {opponentAvatar ? (
                    <AvatarImage source={{ uri: opponentAvatar }} />
                  ) : null}
                  <AvatarFallback className="bg-secondary">
                    <Small className="text-sm font-semibold text-foreground">
                      {opponentInitials}
                    </Small>
                  </AvatarFallback>
                </Avatar>
              </View>
            </View>
            <View className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-background px-1.5 py-0.5">
              <Small className="text-[8px] font-semibold uppercase text-muted-foreground">
                vs
              </Small>
            </View>
          </View>
          <Icon as={ChevronRight} className="size-4 text-muted-foreground" />
        </View>
      </CardContent>
    </Card>
  );
};
