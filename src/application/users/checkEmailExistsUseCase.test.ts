import type { User } from "@/domain/entities/User";
import type { UserRepository } from "@/domain/ports/UserRepository";

import { checkEmailExistsUseCase } from "./checkEmailExistsUseCase";

describe("checkEmailExistsUseCase", () => {
  it("delegates to the repository", async () => {
    const baseUser: User = { id: "user-1" as User["id"] };
    const checkEmailExists = vi.fn().mockResolvedValue(true);
    const repository: UserRepository = {
      checkEmailExists,
      checkUsernameExists: vi.fn().mockResolvedValue(false),
      getCurrentUser: vi.fn().mockResolvedValue(baseUser),
      updateUsername: vi.fn().mockResolvedValue(baseUser),
      updateAvatar: vi.fn().mockResolvedValue(baseUser),
    };

    const result = await checkEmailExistsUseCase(
      repository,
      "test@example.com",
    );

    expect(result).toBe(true);
    expect(checkEmailExists).toHaveBeenCalledWith("test@example.com");
  });
});
