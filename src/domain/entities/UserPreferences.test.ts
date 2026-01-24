import {
  coerceUserPreferences,
  defaultUserPreferences,
  isThemePreference,
} from "./UserPreferences";

describe("UserPreferences", () => {
  it("recognizes valid theme preferences", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
  });

  it("rejects invalid theme preferences", () => {
    expect(isThemePreference("nope")).toBe(false);
    expect(isThemePreference(1)).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it("returns defaults for non-object values", () => {
    expect(coerceUserPreferences(null)).toEqual(defaultUserPreferences);
    expect(coerceUserPreferences("nope")).toEqual(defaultUserPreferences);
  });

  it("coerces invalid fields to defaults", () => {
    expect(
      coerceUserPreferences({
        theme: "invalid",
        gameSounds: "yes",
        haptics: null,
      }),
    ).toEqual(defaultUserPreferences);
  });

  it("keeps valid fields", () => {
    expect(
      coerceUserPreferences({
        theme: "dark",
        gameSounds: false,
        haptics: false,
      }),
    ).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: false,
    });
  });
});
