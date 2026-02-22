import type { ReactNode } from "react";

import { ConvexAuthProvider } from "@convex-dev/auth/react";

import { initConvexClient } from "@/infrastructure/convex/client";

type ConvexProviderProps = {
  children: ReactNode;
};

export function ConvexProvider({ children }: Readonly<ConvexProviderProps>) {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  const convexClient = initConvexClient(convexUrl ?? "");

  return (
    <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>
  );
}
