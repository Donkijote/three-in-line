import { useEffect } from "react";

import { View } from "react-native";

import { useAuthActions } from "@convex-dev/auth/react";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { H1, H4, Lead, Muted, P } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/mobile/components/ui/card";

type SetupScreenProps = {
  onOpenMock?: () => void;
};

const previewItems = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: `Preview Item ${index + 1}`,
  subtitle: "Scrollable content to test navbar overlap and spacing.",
}));

export const SetupScreen = ({ onOpenMock }: SetupScreenProps) => {
  const { mode, toggleTheme } = useTheme();
  const { setHeader } = useMobileHeader();
  const { signOut } = useAuthActions();

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
      <H1 className="text-left text-[34px]">Three In Line</H1>
      <Lead className="text-base">
        React Native + Expo foundation is ready.
      </Lead>

      <Card className="mt-2 gap-2 rounded-2xl py-2">
        <CardHeader className="">
          <CardTitle className="text-lg">
            <H4 className="text-lg">Architecture</H4>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-2 pb-2">
          <Muted>- UI mobile adapter in src/ui/mobile</Muted>
          <Muted>- Shared domain and application layers</Muted>
          <Muted>- Infra adapters remain outside UI</Muted>
        </CardContent>
      </Card>

      <Button className="mt-2" onPress={onOpenMock}>
        <P>Open Mock Screen</P>
      </Button>
      <Button variant="outline" onPress={toggleTheme}>
        <P>
          {mode === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        </P>
      </Button>

      <Button variant="destructive" onPress={signOut}>
        <P>Sign Out</P>
      </Button>

      <View className="mt-2 gap-2">
        {previewItems.map((item) => (
          <Card key={item.id} className="gap-1 rounded-xl py-4">
            <CardContent className="gap-1 pb-0">
              <P className="font-semibold">{item.title}</P>
              <Muted>{item.subtitle}</Muted>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
};
