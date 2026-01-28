import type { UserAvatar } from "@/domain/entities/Avatar";
import type { User } from "@/domain/entities/User";
import type { UserRepository } from "@/domain/ports/UserRepository";

import { updateAvatarUseCase } from "./updateAvatarUseCase";

describe("updateAvatarUseCase", () => {
  it("delegates to the repository", async () => {
    const avatar: UserAvatar = { type: "preset", value: "avatar-5" };
    const updatedUser: User = { id: "user-1" as User["id"], avatar };
    const updateAvatar = vi.fn().mockResolvedValue(updatedUser);
    const repository: UserRepository = {
      checkEmailExists: vi.fn().mockResolvedValue(false),
      checkUsernameExists: vi.fn().mockResolvedValue(false),
      getCurrentUser: vi.fn().mockResolvedValue(updatedUser),
      updateUsername: vi.fn().mockResolvedValue(updatedUser),
      updateAvatar,
    };

    const result = await updateAvatarUseCase(repository, avatar);

    expect(result).toBe(updatedUser);
    expect(updateAvatar).toHaveBeenCalledWith(avatar);
  });
});
