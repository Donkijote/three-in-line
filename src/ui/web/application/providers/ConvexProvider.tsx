import type { ReactNode } from "react";

import { ConvexAuthProvider } from "@convex-dev/auth/react";

import { convexClient } from "@/infrastructure/convex/client";

type ConvexProviderProps = {
  children: ReactNode;
};

export function ConvexProvider({ children }: Readonly<ConvexProviderProps>) {
  return (
    <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>
  );
}
