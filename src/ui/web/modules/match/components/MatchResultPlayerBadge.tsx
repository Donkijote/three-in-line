import { Crown, Frown } from "lucide-react";

import { resolveAvatarSrc, type UserAvatar } from "@/domain/entities/Avatar";
import { H6, Muted } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { cn, getFallbackInitials } from "@/ui/web/lib/utils";

type MatchResultPlayerBadgeProps = {
  name: string;
  avatar?: UserAvatar;
  isWinner: boolean;
  accent: "primary" | "destructive";
  label: string;
};

export const MatchResultPlayerBadge = ({
  name,
  avatar,
  isWinner,
  accent,
  label,
}: MatchResultPlayerBadgeProps) => {
  const resolvedAvatar = resolveAvatarSrc(avatar);
  const initials = getFallbackInitials({ name }) || name.slice(0, 1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar
          size="lg"
          className={cn("size-12 ring-2 ring-destructive/60", {
            "ring-primary/60": accent === "primary",
          })}
        >
          <AvatarImage src={resolvedAvatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {isWinner ? (
          <span
            className={cn(
              "absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full",
              {
                "bg-primary text-primary-foreground": accent === "primary",
              },
            )}
          >
            <Crown className="size-3 rotate-15" />
          </span>
        ) : (
          <span className="absolute -bottom-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-destructive text-destructive-foreground">
            <Frown className="size-3" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-center">
        <H6 className="text-sm font-semibold">{name}</H6>
        <Muted
          className={cn(
            "text-[10px] uppercase tracking-[0.2em] text-destructive",
            {
              "text-primary": accent === "primary",
            },
          )}
        >
          {label}
        </Muted>
      </div>
    </div>
  );
};
