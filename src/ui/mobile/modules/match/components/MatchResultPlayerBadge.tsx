import { Crown, Frown } from "lucide-react-native";
import { View } from "react-native";

import type { UserAvatar } from "@/domain/entities/Avatar";
import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import { H6, Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { cn } from "@/ui/mobile/lib/utils";

type MatchResultPlayerBadgeProps = {
  label: string;
  name: string;
  avatar?: UserAvatar;
  score?: number;
  accentClassName: string;
  isWinner: boolean;
  align?: "left" | "right";
};

export const MatchResultPlayerBadge = ({
  label,
  name,
  avatar,
  score,
  accentClassName,
  isWinner,
  align = "left",
}: MatchResultPlayerBadgeProps) => {
  const avatarSrc = resolveAvatarSrc(avatar);

  return (
    <View
      className={cn("min-w-0 flex-1 gap-2", {
        "items-end": align === "right",
        "items-start": align === "left",
      })}
    >
      <Avatar
        alt={name}
        className={cn("size-14 border-2 bg-card", {
          "border-primary/70": isWinner,
          "border-destructive/70": !isWinner,
        })}
      >
        <Visibility visible={Boolean(avatarSrc)}>
          {avatarSrc ? <AvatarImage source={{ uri: avatarSrc }} /> : null}
        </Visibility>
        <AvatarFallback className="bg-secondary">
          <H6>{name.slice(0, 1)}</H6>
        </AvatarFallback>
      </Avatar>
      <View
        className={cn(
          "absolute top-10 size-5 items-center justify-center rounded-full",
          {
            "-right-1 bg-primary": align === "left" && isWinner,
            "-right-1 bg-destructive": align === "left" && !isWinner,
            "-left-1 bg-primary": align === "right" && isWinner,
            "-left-1 bg-destructive": align === "right" && !isWinner,
          },
        )}
      >
        <Icon
          as={isWinner ? Crown : Frown}
          className="size-3 text-primary-foreground"
        />
      </View>
      <View
        className={cn("gap-1", {
          "items-end": align === "right",
          "items-start": align === "left",
        })}
      >
        <Small className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </Small>
        <H6 className="text-sm" numberOfLines={1}>
          {name}
        </H6>
        <Visibility visible={typeof score === "number"}>
          <Text className={cn("text-xl font-semibold", accentClassName)}>
            {score}
          </Text>
        </Visibility>
      </View>
    </View>
  );
};
