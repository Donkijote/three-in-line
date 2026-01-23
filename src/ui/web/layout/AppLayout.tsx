import type { PropsWithChildren } from "react";

import { useConvexAuth } from "convex/react";

import { ThemeProvider } from "@/ui/web/application/providers/ThemeProvider";
import { NavBar } from "@/ui/web/layout/components/NavBar";
import { cn } from "@/ui/web/lib/utils";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const shouldOffset = isAuthenticated && !isLoading;

  return (
    <ThemeProvider>
      <main
        className={cn(
          "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12",
          shouldOffset ? "pb-24" : "pb-0",
        )}
      >
        {children}
      </main>
      <NavBar />
    </ThemeProvider>
  );
};
