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

  it("writes and reads values", () => {
    writeLocalStorage(localStorageKeys.userPreferences, { theme: "dark" });

    expect(readLocalStorage(localStorageKeys.userPreferences)).toEqual({
      theme: "dark",
    });
  });

  it("returns null for invalid JSON payloads", () => {
    localStorage.setItem(localStorageKeys.userPreferences, "not-json");

    expect(readLocalStorage(localStorageKeys.userPreferences)).toBeNull();
  });

  it("removes values from localStorage", () => {
    writeLocalStorage(localStorageKeys.userPreferences, { theme: "system" });
    removeLocalStorage(localStorageKeys.userPreferences);

    expect(readLocalStorage(localStorageKeys.userPreferences)).toBeNull();
  });
});
