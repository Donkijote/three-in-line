import { Flag, HeartCrack, Trophy, WifiOff } from "lucide-react-native";
import { View } from "react-native";

import { H3, Muted } from "@/ui/mobile/components/Typography";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { cn } from "@/ui/mobile/lib/utils";
import type {
  ResultAccent,
  ResultIcon,
} from "@/ui/shared/match/types/matchResultOverlay";

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
  const iconConfig = resolveResultIcon(icon, accent);

  return (
    <View className="items-center gap-2">
      <View
        className={cn(
          "size-20 items-center justify-center rounded-full",
          iconConfig.containerClassName,
        )}
      >
        <Icon as={iconConfig.icon} className={iconConfig.iconClassName} />
      </View>
      <H3
        className={cn(
          "text-center uppercase tracking-[0.18em]",
          accent === "primary" ? "text-primary" : "text-destructive",
        )}
      >
        {title}
      </H3>
      {subtitle ? (
        <Muted className="mt-0 text-center whitespace-pre-line text-sm leading-6">
          {subtitle}
        </Muted>
      ) : null}
    </View>
  );
};

const resolveResultIcon = (icon: ResultIcon, accent: ResultAccent) => {
  if (icon === "wifi") {
    return {
      icon: WifiOff,
      iconClassName: "size-10 text-amber-500",
      containerClassName: "bg-amber-500/12",
    };
  }

  if (icon === "flag") {
    return {
      icon: Flag,
      iconClassName: "size-10 text-muted-foreground",
      containerClassName: "bg-secondary",
    };
  }

  if (icon === "trophy") {
    return {
      icon: Trophy,
      iconClassName: "size-10 text-primary",
      containerClassName:
        accent === "primary"
          ? "bg-primary/12 border border-primary/20"
          : "bg-destructive/12 border border-destructive/20",
    };
  }

  return {
    icon: HeartCrack,
    iconClassName: "size-10 text-destructive",
    containerClassName: "bg-destructive/12 border border-destructive/20",
  };
};
