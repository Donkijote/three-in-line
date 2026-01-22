import type { PropsWithChildren } from "react";

import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";

import { Navigate } from "@tanstack/react-router";

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return null; // or <FullPageLoader />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Authenticated>{children}</Authenticated>;
};

export const RequireUnAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Unauthenticated>{children}</Unauthenticated>;
};
