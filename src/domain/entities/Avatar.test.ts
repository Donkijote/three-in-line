import {
  getRandomPresetAvatarId,
  isPresetAvatarId,
  PRESET_AVATAR_IDS,
} from "./Avatar";

describe("Avatar domain", () => {
  it("recognizes valid preset avatar ids", () => {
    expect(isPresetAvatarId("avatar-1")).toBe(true);
    expect(isPresetAvatarId("avatar-38")).toBe(true);
  });

  it("rejects invalid preset avatar ids", () => {
    expect(isPresetAvatarId("avatar-0")).toBe(false);
    expect(isPresetAvatarId("avatar-39")).toBe(false);
    expect(isPresetAvatarId("not-an-avatar")).toBe(false);
  });

  it("returns a random preset avatar id from the canonical list", () => {
    const randomId = getRandomPresetAvatarId();
    expect(PRESET_AVATAR_IDS).toContain(randomId);
  });
});
