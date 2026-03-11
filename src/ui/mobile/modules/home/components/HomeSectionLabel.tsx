import { View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";

type HomeSectionLabelProps = {
  text: string;
};

export const HomeSectionLabel = ({ text }: HomeSectionLabelProps) => {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1 bg-border/60" />
      <Small variant="label" className="text-[10px] text-muted-foreground/80">
        {text}
      </Small>
      <View className="h-px flex-1 bg-border/60" />
    </View>
  );
};
