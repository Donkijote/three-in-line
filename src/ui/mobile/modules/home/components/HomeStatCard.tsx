import { Flame, Swords, Trophy } from "lucide-react-native";
import { View } from "react-native";

import { H4, Small } from "@/ui/mobile/components/Typography";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { cn } from "@/ui/mobile/lib/utils";
import {
  type HomeStatIconName,
  homeStatStyles,
} from "@/ui/shared/home/style/homeStatStyles";
import type { HomeStat } from "@/ui/shared/home/types/types";

const iconByName: Record<HomeStatIconName, typeof Trophy> = {
  flame: Flame,
  swords: Swords,
  trophy: Trophy,
} as const;

export const HomeStatCard = ({ label, value, accent }: HomeStat) => {
  const statStyle = homeStatStyles[accent];
  const IconComponent = iconByName[statStyle.icon];

  return (
    <Card
      className={cn(
        "min-w-36 flex-1 gap-0 rounded-3xl border-border/60 bg-card/95 py-0",
        "shadow-sm shadow-black/5",
      )}
    >
      <CardContent className="px-4 py-4">
        <View className="mb-3 flex-row items-center gap-2">
          <View
            className={cn(
              "size-6 items-center justify-center rounded-full",
              statStyle.iconContainerClassName,
            )}
          >
            <Icon
              as={IconComponent}
              className={cn("size-3.5", statStyle.iconClassName)}
            />
          </View>
          <Small variant="label" className="text-[10px] text-muted-foreground">
            {label}
          </Small>
        </View>

        <H4 className="text-3xl leading-none text-foreground">{value}</H4>
      </CardContent>
    </Card>
  );
};
