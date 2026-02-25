import type { PropsWithChildren } from "react";

import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "@/infrastructure/convex/auth";
import { Muted } from "@/ui/mobile/components/Typography";

type MobileAuthLoaderProps = {
  message: string;
};

const MobileAuthLoader = ({ message }: MobileAuthLoaderProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator />
      <Muted>{message}</Muted>
    </View>
  );
};

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <MobileAuthLoader message="Loading session..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Authenticated>{children}</Authenticated>;
};

export const RequireUnAuth = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <MobileAuthLoader message="Checking access..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Unauthenticated>{children}</Unauthenticated>;
};
