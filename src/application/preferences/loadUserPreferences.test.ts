import { describe, expect, it, vi } from "vitest";

import { loadUserPreferences } from "./loadUserPreferences";

describe("loadUserPreferences", () => {
  it("returns repository preferences", () => {
    const repository = {
      load: vi.fn(() => ({
        theme: "dark",
        gameSounds: false,
        haptics: true,
      })),
      save: vi.fn(),
    };

    const result = loadUserPreferences(repository);

    expect(result).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: true,
    });
    expect(repository.load).toHaveBeenCalledTimes(1);
  });
});
