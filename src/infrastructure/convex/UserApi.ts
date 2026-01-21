import { useCallback } from "react";

import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";

export function useCheckCodenameExists() {
  const convex = useConvex();

  return useCallback(
    async (codeName: string) => {
      return await convex.query(api.users.checkCodenameExists, { codeName });
    },
    [convex],
  );
}
