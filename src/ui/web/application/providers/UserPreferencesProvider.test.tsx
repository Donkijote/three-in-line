import { act, renderHook } from "@testing-library/react";

import { UserPreferencesProvider, useUserPreferences } from "./UserPreferencesProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserPreferencesProvider>{children}</UserPreferencesProvider>
);

describe("UserPreferencesProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads default preferences when none are stored", () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    expect(result.current.preferences).toEqual({
      theme: "system",
      gameSounds: true,
      haptics: true,
    });
  });

  it("hydrates preferences from storage", () => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ theme: "dark", gameSounds: false, haptics: true }),
    );

    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    expect(result.current.preferences).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: true,
    });
  });

  it("updates preferences and persists them", () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    act(() => {
      result.current.updatePreferences({ gameSounds: false });
    });

    expect(result.current.preferences).toEqual({
      theme: "system",
      gameSounds: false,
      haptics: true,
    });
    expect(localStorage.getItem("userPreferences")).toBe(
      JSON.stringify({
        theme: "system",
        gameSounds: false,
        haptics: true,
      }),
    );
  });

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useUserPreferences())).toThrow(
      "useUserPreferences must be used within UserPreferencesProvider",
    );
  });
});
