import type { UserRepository } from "@/domain/ports/UserRepository";

export const checkEmailExistsUseCase = (
  repository: UserRepository,
  email: string,
) => repository.checkEmailExists(email);
