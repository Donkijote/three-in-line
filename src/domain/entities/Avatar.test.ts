import {
  getRandomPresetAvatarId,
  isPresetAvatarId,
  PRESET_AVATAR_IDS,
  resolveAvatarSrc,
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

  it("returns undefined when resolving a missing avatar", () => {
    expect(resolveAvatarSrc()).toBeUndefined();
  });

  it("maps preset avatars to their asset path", () => {
    expect(resolveAvatarSrc({ type: "preset", value: "avatar-12" })).toBe(
      "/avatars/avatar-12.svg",
    );
  });

  it("returns the raw value for generated avatars", () => {
    expect(resolveAvatarSrc({ type: "generated", value: "seed-123" })).toBe(
      "seed-123",
    );
  });

  it("returns the raw value for custom avatars", () => {
    expect(resolveAvatarSrc({ type: "custom", value: "storage-999" })).toBe(
      "storage-999",
    );
  });
});
