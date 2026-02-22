import type { ReactNode } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { MobileHeaderProvider } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { ThemeProvider } from "@/ui/mobile/application/providers/ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MobileHeaderProvider>{children}</MobileHeaderProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};
