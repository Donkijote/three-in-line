import { fireEvent } from "@testing-library/react-native";

import { createUserPreferences } from "@/test/mobile/fixtures/preferences";
import { renderMobile } from "@/test/mobile/render";

import { PreferencesSection } from "./PreferencesSection";

const mockSetTheme = jest.fn();
const mockUseTheme = jest.fn();
const mockUpdatePreferences = jest.fn();
const mockUseUserPreferences = jest.fn();
const renderedIcons: string[] = [];

jest.mock("@/ui/mobile/application/providers/ThemeProvider", () => ({
  useTheme: () => mockUseTheme(),
}));

jest.mock("@/ui/mobile/application/providers/UserPreferencesProvider", () => ({
  useUserPreferences: () => mockUseUserPreferences(),
}));

jest.mock("@/ui/mobile/components/ui/switch", () => {
  const { createSwitchStub } = require("@/test/mobile/componentMocks");

  return {
    Switch: createSwitchStub(),
  };
});

jest.mock("@/ui/mobile/components/ui/card", () => {
  const { createViewStub } = require("@/test/mobile/componentMocks");

  return {
    Card: createViewStub(),
    CardContent: createViewStub(),
  };
});

jest.mock("@/ui/mobile/components/ui/icon", () => ({
  Icon: ({ as }: { as: { displayName?: string } }) => {
    renderedIcons.push(as.displayName ?? "unknown");
    return null;
  },
}));

jest.mock("@/ui/mobile/components/ui/separator", () => ({
  Separator: () => null,
}));

describe("PreferencesSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderedIcons.length = 0;
    mockUseTheme.mockReturnValue({
      isDark: false,
      setTheme: mockSetTheme,
    });
    mockUseUserPreferences.mockReturnValue({
      preferences: createUserPreferences(),
      updatePreferences: mockUpdatePreferences,
    });
  });

  it("updates preferences and theme from the switch controls", () => {
    const screen = renderMobile(<PreferencesSection />);

    fireEvent.press(screen.getAllByText("on")[0]!);
    fireEvent.press(screen.getAllByText("on")[1]!);
    fireEvent.press(screen.getByText("off"));

    expect(mockUpdatePreferences).toHaveBeenNthCalledWith(1, {
      gameSounds: false,
    });
    expect(mockUpdatePreferences).toHaveBeenNthCalledWith(2, {
      haptics: false,
    });
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("selects the correct icon variants for disabled preferences and dark mode", () => {
    mockUseTheme.mockReturnValue({
      isDark: true,
      setTheme: mockSetTheme,
    });
    mockUseUserPreferences.mockReturnValue({
      preferences: createUserPreferences({
        gameSounds: false,
        haptics: false,
      }),
      updatePreferences: mockUpdatePreferences,
    });

    renderMobile(<PreferencesSection />);

    expect(renderedIcons).toEqual(["VolumeOff", "VibrateOff", "Moon"]);
  });

  it("uses the enabled preference icons in light mode", () => {
    renderMobile(<PreferencesSection />);

    expect(renderedIcons).toEqual(["Volume2", "Vibrate", "Sun"]);
  });
});
