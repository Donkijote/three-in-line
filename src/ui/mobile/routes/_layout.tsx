import "react-native-gesture-handler";
import "../styles/global.css";

import { Slot } from "expo-router";

import { AppProviders } from "@/ui/mobile/application/providers/AppProviders";
import { AppLayout } from "@/ui/mobile/layout/AppLayout";

export default function RootLayout() {
  return (
    <AppProviders>
      <AppLayout>
        <Slot />
      </AppLayout>
    </AppProviders>
  );
}
