import {
  localStorageKeys,
  readLocalStorage,
  removeLocalStorage,
  writeLocalStorage,
} from "./webLocalStorage";

describe("webLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes and reads theme preference values", () => {
    writeLocalStorage(localStorageKeys.themePreference, "dark");

    expect(readLocalStorage(localStorageKeys.themePreference)).toBe("dark");
  });

  it("returns null for invalid JSON payloads", () => {
    localStorage.setItem(localStorageKeys.themePreference, "not-json");

    expect(readLocalStorage(localStorageKeys.themePreference)).toBeNull();
  });

  it("returns null for unsupported theme preferences", () => {
    localStorage.setItem(
      localStorageKeys.themePreference,
      JSON.stringify("nope"),
    );

    expect(readLocalStorage(localStorageKeys.themePreference)).toBeNull();
  });

  it("removes values from localStorage", () => {
    writeLocalStorage(localStorageKeys.themePreference, "system");
    removeLocalStorage(localStorageKeys.themePreference);

    expect(readLocalStorage(localStorageKeys.themePreference)).toBeNull();
  });
});
