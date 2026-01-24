import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PreferencesSection } from "./PreferencesSection";

const updatePreferences = vi.fn();
const setTheme = vi.fn();

vi.mock("@/ui/web/application/providers/ThemeProvider", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme }),
}));

vi.mock("@/ui/web/application/providers/UserPreferencesProvider", () => ({
  useUserPreferences: () => ({
    preferences: { theme: "system", gameSounds: true, haptics: false },
    updatePreferences,
  }),
}));

vi.mock("@/ui/web/components/ui/switch", () => ({
  Switch: ({
    checked,
    onCheckedChange,
    id,
  }: {
    checked: boolean;
    onCheckedChange: (value: boolean) => void;
    id?: string;
  }) => (
    <button type="button" data-testid={id} onClick={() => onCheckedChange(!checked)}>
      {checked ? "on" : "off"}
    </button>
  ),
}));

describe("PreferencesSection", () => {
  it("toggles game sounds and haptics preferences", () => {
    render(<PreferencesSection />);

    fireEvent.click(screen.getByTestId("switch-game-sounds"));
    expect(updatePreferences).toHaveBeenCalledWith({ gameSounds: false });

    fireEvent.click(screen.getByTestId("switch-haptic-feedback"));
    expect(updatePreferences).toHaveBeenCalledWith({ haptics: true });
  });

  it("switches to dark theme when toggled", () => {
    render(<PreferencesSection />);

    fireEvent.click(screen.getByTestId("switch-dark-theme"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
