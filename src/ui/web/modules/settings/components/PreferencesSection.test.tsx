import { fireEvent, render, screen } from "@testing-library/react";

import { PreferencesSection } from "./PreferencesSection";

const updatePreferences = vi.fn();
const setTheme = vi.fn();
const useThemeMock = vi.fn();
const useUserPreferencesMock = vi.fn();
const renderedIcons: string[] = [];

vi.mock("lucide-react", async () => {
  const actual =
    await vi.importActual<typeof import("lucide-react")>("lucide-react");
  const createIcon = (name: string) => () => {
    renderedIcons.push(name);
    return <svg data-testid={`icon-${name}`} />;
  };

  return {
    ...actual,
    Moon: createIcon("Moon"),
    Sun: createIcon("Sun"),
    Vibrate: createIcon("Vibrate"),
    VibrateOff: createIcon("VibrateOff"),
    Volume2: createIcon("Volume2"),
    VolumeOff: createIcon("VolumeOff"),
  };
});

vi.mock("@/ui/web/application/providers/ThemeProvider", () => ({
  useTheme: () => useThemeMock(),
}));

vi.mock("@/ui/web/application/providers/UserPreferencesProvider", () => ({
  useUserPreferences: () => useUserPreferencesMock(),
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
    <button
      type="button"
      data-testid={id}
      onClick={() => onCheckedChange(!checked)}
    >
      {checked ? "on" : "off"}
    </button>
  ),
}));

describe("PreferencesSection", () => {
  beforeEach(() => {
    renderedIcons.length = 0;
    useThemeMock.mockReturnValue({ resolvedTheme: "light", setTheme });
    useUserPreferencesMock.mockReturnValue({
      preferences: { theme: "system", gameSounds: true, haptics: false },
      updatePreferences,
    });
  });

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

  it("switches back to light theme when dark mode is already active", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark", setTheme });

    render(<PreferencesSection />);

    fireEvent.click(screen.getByTestId("switch-dark-theme"));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("renders the correct icon variants for the current preference values", () => {
    render(<PreferencesSection />);

    expect(renderedIcons).toEqual(["Volume2", "VibrateOff", "Sun"]);
  });

  it("renders the muted icons when sounds and haptics are disabled in dark mode", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark", setTheme });
    useUserPreferencesMock.mockReturnValue({
      preferences: { theme: "dark", gameSounds: false, haptics: false },
      updatePreferences,
    });

    render(<PreferencesSection />);

    expect(renderedIcons).toEqual(["VolumeOff", "VibrateOff", "Moon"]);
  });
});
