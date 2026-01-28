import type { UserAvatar } from "@/domain/entities/Avatar";
import type { UserRepository } from "@/domain/ports/UserRepository";

export const updateAvatarUseCase = (
  repository: UserRepository,
  avatar: UserAvatar,
) => repository.updateAvatar(avatar);
