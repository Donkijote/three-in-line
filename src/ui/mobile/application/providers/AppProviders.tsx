import type { ReactNode } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { ConvexProvider } from "@/ui/mobile/application/providers/ConvexProvider";
import { MobileHeaderProvider } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { ThemeProvider } from "@/ui/mobile/application/providers/ThemeProvider";
import { UserPreferencesProvider } from "@/ui/mobile/application/providers/UserPreferencesProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ConvexProvider>
      <SafeAreaProvider>
        <UserPreferencesProvider>
          <ThemeProvider>
            <MobileHeaderProvider>{children}</MobileHeaderProvider>
          </ThemeProvider>
        </UserPreferencesProvider>
      </SafeAreaProvider>
    </ConvexProvider>
  );
};
