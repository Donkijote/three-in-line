import { getConvexClient } from "@/infrastructure/convex/client";

export const mutation = (
  mutationRef: Parameters<ReturnType<typeof getConvexClient>["mutation"]>[0],
  args?: Parameters<ReturnType<typeof getConvexClient>["mutation"]>[1],
) => {
  if (args === undefined) {
    return getConvexClient().mutation(mutationRef);
  }

  return getConvexClient().mutation(mutationRef, args);
};
