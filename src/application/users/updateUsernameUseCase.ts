import type { UserRepository } from "@/domain/ports/UserRepository";

export const updateUsernameUseCase = (
  repository: UserRepository,
  username: string,
) => repository.updateUsername(username);
