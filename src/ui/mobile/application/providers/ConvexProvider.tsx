import type { ReactNode } from "react";

import * as SecureStore from "expo-secure-store";

import { ConvexAuthProvider, type TokenStorage } from "@convex-dev/auth/react";

import { initConvexClient } from "@/infrastructure/convex/client";

type ConvexProviderProps = {
  children: ReactNode;
};

const secureStoreStorage: TokenStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const ConvexProvider = ({ children }: ConvexProviderProps) => {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  const convexClient = initConvexClient(convexUrl ?? "");

  return (
    <ConvexAuthProvider client={convexClient} storage={secureStoreStorage}>
      {children}
    </ConvexAuthProvider>
  );
};
