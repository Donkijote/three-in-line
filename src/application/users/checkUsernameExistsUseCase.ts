import type { UserRepository } from "@/domain/ports/UserRepository";

export const checkUsernameExistsUseCase = (
  repository: UserRepository,
  username: string,
) => repository.checkUsernameExists(username);
