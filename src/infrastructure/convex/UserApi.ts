import { useCallback, useState } from "react";

import { useConvex, useMutation, useQuery } from "convex/react";

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

export function useCheckUsernameExists() {
  const convex = useConvex();
  const [isChecking, setIsChecking] = useState(false);

  const checkUsernameExists = useCallback(
    async (username: string) => {
      setIsChecking(true);
      try {
        return await convex.query(api.users.checkUsernameExists, { username });
      } finally {
        setIsChecking(false);
      }
    },
    [convex],
  );

  return { checkUsernameExists, isChecking };
}

export function useCurrentUser() {
  return useQuery(api.users.getCurrentUser);
}

export function useUpdateUsername() {
  return useMutation(api.users.updateUsername);
}

export function useUpdateAvatar() {
  return useMutation(api.users.updateAvatar);
}
