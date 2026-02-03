import {
  getPresetAvatarById,
  PRESET_AVATARS,
  pickRandomPresetAvatars,
} from "./index";

describe("avatars index exports", () => {
  it("exposes preset avatar utilities", () => {
    expect(PRESET_AVATARS.length).toBeGreaterThan(0);
    expect(getPresetAvatarById("avatar-1").id).toBe("avatar-1");
    expect(pickRandomPresetAvatars(2)).toHaveLength(2);
  });
});
