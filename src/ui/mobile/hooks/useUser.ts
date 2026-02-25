import { useCallback } from "react";

import { updateAvatarUseCase } from "@/application/users/updateAvatarUseCase";
import type { UserAvatar } from "@/domain/entities/Avatar";
import { userRepository } from "@/infrastructure/convex/repository/userRepository";

export function useUpdateAvatar() {
  return useCallback(async ({ avatar }: { avatar: UserAvatar }) => {
    return await updateAvatarUseCase(userRepository, avatar);
  }, []);
}
