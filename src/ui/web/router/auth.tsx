import type { PropsWithChildren } from "react";

import { Navigate } from "@tanstack/react-router";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "@/infrastructure/convex/auth";
import { FullPageLoader } from "@/ui/web/components/FullPageLoader";

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <FullPageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Authenticated>{children}</Authenticated>;
};

export const RequireUnAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <FullPageLoader message="Unauthorized" />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Unauthenticated>{children}</Unauthenticated>;
};
