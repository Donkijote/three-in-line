import { getConvexClient } from "@/infrastructure/convex/client";

export const query = (
  queryRef: Parameters<ReturnType<typeof getConvexClient>["query"]>[0],
  args?: Parameters<ReturnType<typeof getConvexClient>["query"]>[1],
) => {
  if (args === undefined) {
    return getConvexClient().query(queryRef);
  }

  return getConvexClient().query(queryRef, args);
};
