import type { ReactNode } from "react";

import { ConvexProvider as ConvexReactProvider } from "convex/react";

import { convexClient } from "@/infrastructure/convex/client";

type ConvexProviderProps = {
  children: ReactNode;
};

export function ConvexProvider({ children }: Readonly<ConvexProviderProps>) {
  return (
    <ConvexReactProvider client={convexClient}>{children}</ConvexReactProvider>
  );
}
