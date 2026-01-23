import {
  loadThemePreference,
  saveThemePreference,
} from "./storage";

describe("theme storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads the saved theme preference", () => {
    saveThemePreference("dark");

    expect(loadThemePreference()).toBe("dark");
  });

  it("returns null when no theme preference exists", () => {
    expect(loadThemePreference()).toBeNull();
  });
});
