import type { UserPreferences } from "@/domain/entities/UserPreferences";

import { updateUserPreferences } from "./updateUserPreferences";

describe("updateUserPreferences", () => {
  it("loads, merges, saves, and returns preferences", () => {
    const repository = {
      load: vi.fn(() => ({
        theme: "dark",
        gameSounds: true,
        haptics: false,
      })),
      save: vi.fn(),
    };

    const result = updateUserPreferences(repository, { gameSounds: false });

    expect(repository.load).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith({
      theme: "dark",
      gameSounds: false,
      haptics: false,
    });
    expect(result).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: false,
    });
  });

  it("uses current preferences and coerces invalid updates", () => {
    const repository = {
      load: vi.fn(() => ({
        theme: "light",
        gameSounds: false,
        haptics: true,
      })),
      save: vi.fn(),
    };
    const current: UserPreferences = {
      theme: "dark",
      gameSounds: true,
      haptics: false,
    };

    const result = updateUserPreferences(
      repository,
      { theme: "nope" as UserPreferences["theme"] },
      current,
    );

    expect(repository.load).not.toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith({
      theme: "system",
      gameSounds: true,
      haptics: false,
    });
    expect(result).toEqual({
      theme: "system",
      gameSounds: true,
      haptics: false,
    });
  });
});
