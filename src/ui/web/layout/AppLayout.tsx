import type { PropsWithChildren } from "react";

import { useConvexAuth } from "@/infrastructure/convex/auth";
import { ThemeProvider } from "@/ui/web/application/providers/ThemeProvider";
import { UserPreferencesProvider } from "@/ui/web/application/providers/UserPreferencesProvider";
import { ScrollArea } from "@/ui/web/components/ui/scroll-area";
import { NavBar } from "@/ui/web/layout/components/NavBar";
import { cn } from "@/ui/web/lib/utils";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const shouldOffset = isAuthenticated && !isLoading;

  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <ScrollArea className={"h-[100svh] md:h-screen"}>
          <main
            className={cn(
              "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12",
              shouldOffset ? "pb-24 has-[.no-offset]:pb-0" : "pb-0",
            )}
          >
            {children}
          </main>
        </ScrollArea>
        <NavBar />
      </ThemeProvider>
    </UserPreferencesProvider>
  );
};
