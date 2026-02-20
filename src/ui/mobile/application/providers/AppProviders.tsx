import type { ReactNode } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/ui/mobile/application/providers/ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
};
