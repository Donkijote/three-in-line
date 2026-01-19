import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL env var for Convex.");
}

export const convexClient = new ConvexReactClient(convexUrl);
