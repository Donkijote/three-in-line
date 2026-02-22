import { useEffect } from "react";

import { View } from "react-native";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { Button } from "@/ui/mobile/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/mobile/components/ui/card";
import { Text } from "@/ui/mobile/components/ui/text";

type MobileSetupScreenProps = {
  onOpenMock?: () => void;
};

const previewItems = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: `Preview Item ${index + 1}`,
  subtitle: "Scrollable content to test navbar overlap and spacing.",
}));

export const MobileSetupScreen = ({ onOpenMock }: MobileSetupScreenProps) => {
  const { mode, toggleTheme } = useTheme();
  const { setHeader } = useMobileHeader();

  useEffect(() => {
    setHeader({
      title: "Home",
      eyebrow: "Mobile Milestone",
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  return (
    <View className="flex-1 gap-4">
      <Text variant="h1" className="text-left text-[34px]">
        Three In Line
      </Text>
      <Text variant="lead" className="text-base">
        React Native + Expo foundation is ready.
      </Text>

      <Card className="mt-2 gap-2 rounded-2xl py-2">
        <CardHeader className="">
          <CardTitle className="text-lg">Architecture</CardTitle>
        </CardHeader>
        <CardContent className="gap-2 pb-2">
          <Text variant="muted">- UI mobile adapter in src/ui/mobile</Text>
          <Text variant="muted">- Shared domain and application layers</Text>
          <Text variant="muted">- Infra adapters remain outside UI</Text>
        </CardContent>
      </Card>

      <Button className="mt-2" onPress={onOpenMock}>
        <Text>Open Mock Screen</Text>
      </Button>
      <Button variant="outline" onPress={toggleTheme}>
        <Text>
          {mode === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        </Text>
      </Button>

      <View className="mt-2 gap-2">
        {previewItems.map((item) => (
          <Card key={item.id} className="gap-1 rounded-xl py-4">
            <CardContent className="gap-1 pb-0">
              <Text className="font-semibold">{item.title}</Text>
              <Text variant="muted">{item.subtitle}</Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
};
