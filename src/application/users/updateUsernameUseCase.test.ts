import type { User } from "@/domain/entities/User";
import type { UserRepository } from "@/domain/ports/UserRepository";

import { updateUsernameUseCase } from "./updateUsernameUseCase";

describe("updateUsernameUseCase", () => {
  it("delegates to the repository", async () => {
    const updatedUser: User = {
      id: "user-1" as User["id"],
      username: "after",
    };
    const updateUsername = vi.fn().mockResolvedValue(updatedUser);
    const repository: UserRepository = {
      checkEmailExists: vi.fn().mockResolvedValue(false),
      checkUsernameExists: vi.fn().mockResolvedValue(false),
      getCurrentUser: vi.fn().mockResolvedValue(updatedUser),
      updateUsername,
      updateAvatar: vi.fn().mockResolvedValue(updatedUser),
    };

    const result = await updateUsernameUseCase(repository, "after");

    expect(result).toBe(updatedUser);
    expect(updateUsername).toHaveBeenCalledWith("after");
  });
});
