import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PresetAvatarId } from "@/domain/entities/Avatar";

import {
  PRESET_AVATARS,
  getPresetAvatarById,
  pickRandomPresetAvatars,
} from "./presets";

describe("avatar presets", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns preset metadata by id", () => {
    const avatar = getPresetAvatarById("avatar-1");

    expect(avatar.id).toBe("avatar-1");
    expect(avatar.src).toBe("/avatars/avatar-1.svg");
  });

  it("returns all presets when count exceeds list size", () => {
    const avatars = pickRandomPresetAvatars(PRESET_AVATARS.length + 1);

    expect(avatars).toHaveLength(PRESET_AVATARS.length);
    expect(avatars.map((avatar) => avatar.id)).toEqual(
      PRESET_AVATARS.map((avatar) => avatar.id),
    );
  });

  it("returns a stable slice when Math.random is deterministic", () => {
    let callCount = 0;
    vi.spyOn(Math, "random").mockImplementation(() => {
      callCount += 1;
      return callCount / 100;
    });

    const avatars = pickRandomPresetAvatars(3);

    expect(avatars).toHaveLength(3);
    expect(avatars.map((avatar) => avatar.id)).toEqual([
      "avatar-1",
      "avatar-2",
      "avatar-3",
    ] as PresetAvatarId[]);
  });
});
