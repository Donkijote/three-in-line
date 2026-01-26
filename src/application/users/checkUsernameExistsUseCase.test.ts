import type { User } from "@/domain/entities/User";
import type { UserRepository } from "@/domain/ports/UserRepository";

import { checkUsernameExistsUseCase } from "./checkUsernameExistsUseCase";

describe("checkUsernameExistsUseCase", () => {
  it("delegates to the repository", async () => {
    const baseUser: User = { id: "user-1" as User["id"] };
    const checkUsernameExists = vi.fn().mockResolvedValue(true);
    const repository: UserRepository = {
      checkEmailExists: vi.fn().mockResolvedValue(false),
      checkUsernameExists,
      getCurrentUser: vi.fn().mockResolvedValue(baseUser),
      updateUsername: vi.fn().mockResolvedValue(baseUser),
      updateAvatar: vi.fn().mockResolvedValue(baseUser),
    };

    const result = await checkUsernameExistsUseCase(repository, "gamer");

    expect(result).toBe(true);
    expect(checkUsernameExists).toHaveBeenCalledWith("gamer");
  });
});
