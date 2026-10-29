import type { PropsWithChildren } from "react";

import { Redirect } from "expo-router";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "@/infrastructure/convex/auth";
import { FullPageLoader } from "@/ui/mobile/components/FullPageLoader";

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Authenticated>{children}</Authenticated>;
};

export const RequireUnAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <FullPageLoader message="Unauthorized" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Unauthenticated>{children}</Unauthenticated>;
};
