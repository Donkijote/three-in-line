import { useCallback, useState } from "react";

import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";

export function useCheckCodenameExists() {
  const convex = useConvex();
  const [isChecking, setIsChecking] = useState(false);

  const checkCodenameExists = useCallback(
    async (codeName: string) => {
      setIsChecking(true);
      try {
        return await convex.query(api.users.checkCodenameExists, { codeName });
      } finally {
        setIsChecking(false);
      }
    },
    [convex],
  );

  return { checkCodenameExists, isChecking };
}
