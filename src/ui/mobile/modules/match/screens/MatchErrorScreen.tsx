import { View } from "react-native";

import { H3, Muted } from "@/ui/mobile/components/Typography";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";

type MatchErrorScreenProps = {
  title: string;
  description: string;
};

export const MatchErrorScreen = ({
  title,
  description,
}: MatchErrorScreenProps) => {
  return (
    <View className="flex-1 justify-center">
      <Card className="rounded-3xl border-border/60">
        <CardContent className="gap-2 px-6 py-6">
          <H3 className="text-left text-xl">{title}</H3>
          <Muted className="mt-0 text-base leading-6">{description}</Muted>
        </CardContent>
      </Card>
    </View>
  );
};
