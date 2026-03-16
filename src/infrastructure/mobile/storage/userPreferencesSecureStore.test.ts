import * as SecureStore from "expo-secure-store";

import { userPreferencesSecureStoreRepository } from "./userPreferencesSecureStore";

jest.mock("expo-secure-store", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("userPreferencesSecureStoreRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads stored preferences", () => {
    jest.mocked(SecureStore.getItem).mockReturnValue(
      JSON.stringify({
        theme: "dark",
        gameSounds: false,
        haptics: true,
      }),
    );

    expect(userPreferencesSecureStoreRepository.load()).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: true,
    });
  });

  it("falls back to default preferences when storage is empty", () => {
    jest.mocked(SecureStore.getItem).mockReturnValue(null);

    expect(userPreferencesSecureStoreRepository.load()).toEqual({
      theme: "system",
      gameSounds: true,
      haptics: true,
    });
  });

  it("logs and falls back when loading fails", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    jest.mocked(SecureStore.getItem).mockImplementation(() => {
      throw new Error("boom");
    });

    expect(userPreferencesSecureStoreRepository.load()).toEqual({
      theme: "system",
      gameSounds: true,
      haptics: true,
    });
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load mobile user preferences",
      expect.any(Error),
    );
  });

  it("saves preferences into secure storage", () => {
    userPreferencesSecureStoreRepository.save({
      theme: "light",
      gameSounds: false,
      haptics: false,
    });

    expect(SecureStore.setItem).toHaveBeenCalledWith(
      "userPreferences",
      JSON.stringify({
        theme: "light",
        gameSounds: false,
        haptics: false,
      }),
    );
  });

  it("logs when saving fails", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    jest.mocked(SecureStore.setItem).mockImplementation(() => {
      throw new Error("boom");
    });

    userPreferencesSecureStoreRepository.save({
      theme: "system",
      gameSounds: true,
      haptics: true,
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to save mobile user preferences",
      expect.any(Error),
    );
  });
});
