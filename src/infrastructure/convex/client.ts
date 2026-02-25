import { ConvexReactClient } from "convex/react";

let convexClient: ConvexReactClient | null = null;

export const initConvexClient = (convexUrl: string): ConvexReactClient => {
  const normalizedUrl = convexUrl.trim();
  if (!normalizedUrl) {
    throw new Error("Missing Convex URL env var.");
  }

  if (!convexClient) {
    convexClient = new ConvexReactClient(normalizedUrl);
  }

  return convexClient;
};

export const getConvexClient = (): ConvexReactClient => {
  if (!convexClient) {
    throw new Error(
      "Convex client has not been initialized. Initialize it from a platform provider first.",
    );
  }

  return convexClient;
};
