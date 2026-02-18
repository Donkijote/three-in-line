import "react-native-gesture-handler";
import "../styles/global.css";

import { Stack } from "expo-router";

import { AppProviders } from "@/ui/mobile/application/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AppProviders>
  );
}
