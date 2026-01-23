import { useCallback, useState } from "react";

import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";

export function useCheckEmailExists() {
  const convex = useConvex();
  const [isChecking, setIsChecking] = useState(false);

  const checkEmailExists = useCallback(
    async (email: string) => {
      setIsChecking(true);
      try {
        return await convex.query(api.users.checkEmailExists, { email });
      } finally {
        setIsChecking(false);
      }
    },
    [convex],
  );

  return { checkEmailExists, isChecking };
}
