import { useCallback, useState } from "react";

import { checkEmailExistsUseCase } from "@/application/users/checkEmailExistsUseCase";
import { checkUsernameExistsUseCase } from "@/application/users/checkUsernameExistsUseCase";
import { updateAvatarUseCase } from "@/application/users/updateAvatarUseCase";
import { updateUsernameUseCase } from "@/application/users/updateUsernameUseCase";
import type { UserAvatar } from "@/domain/entities/Avatar";
import { userRepository } from "@/infrastructure/convex/repository/userRepository";
import {
  useCurrentUserQuery,
  useUserByIdQuery,
} from "@/infrastructure/convex/UserApi";

export function useCheckEmailExists() {
  const [isChecking, setIsChecking] = useState(false);

  const checkEmailExists = useCallback(async (email: string) => {
    setIsChecking(true);
    try {
      return await checkEmailExistsUseCase(userRepository, email);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { checkEmailExists, isChecking };
}

export function useCheckUsernameExists() {
  const [isChecking, setIsChecking] = useState(false);

  const checkUsernameExists = useCallback(async (username: string) => {
    setIsChecking(true);
    try {
      return await checkUsernameExistsUseCase(userRepository, username);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { checkUsernameExists, isChecking };
}

export function useCurrentUser() {
  return useCurrentUserQuery();
}

export function useUserById(userId?: string | null) {
  return useUserByIdQuery(userId);
}

export function useUpdateUsername() {
  return useCallback(async ({ username }: { username: string }) => {
    return await updateUsernameUseCase(userRepository, username);
  }, []);
}

export function useUpdateAvatar() {
  return useCallback(async ({ avatar }: { avatar: UserAvatar }) => {
    return await updateAvatarUseCase(userRepository, avatar);
  }, []);
}
