import { userPreferencesLocalStorageRepository } from "@/infrastructure/storage/userPreferencesLocalStorage";

describe("userPreferencesLocalStorageRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns defaults when no preferences exist", () => {
    expect(userPreferencesLocalStorageRepository.load()).toEqual({
      theme: "system",
      gameSounds: true,
      haptics: true,
    });
  });

  it("loads saved preferences", () => {
    userPreferencesLocalStorageRepository.save({
      theme: "dark",
      gameSounds: false,
      haptics: true,
    });

    expect(userPreferencesLocalStorageRepository.load()).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: true,
    });
  });

  it("coerces invalid values to defaults", () => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ theme: "nope", gameSounds: "yep", haptics: null }),
    );

    expect(userPreferencesLocalStorageRepository.load()).toEqual({
      theme: "system",
      gameSounds: true,
      haptics: true,
    });
  });
});
