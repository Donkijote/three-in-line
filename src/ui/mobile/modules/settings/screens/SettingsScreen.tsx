import { useEffect } from "react";

import { View } from "react-native";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { H2, Muted } from "@/ui/mobile/components/Typography";

export const SettingsScreen = () => {
  const { setHeader } = useMobileHeader();

  useEffect(() => {
    setHeader({
      title: "Settings",
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  return (
    <View className="flex-1 gap-2">
      <H2>Settings</H2>
      <Muted>
        Settings route scaffold is ready for the next implementation step.
      </Muted>
    </View>
  );
};
