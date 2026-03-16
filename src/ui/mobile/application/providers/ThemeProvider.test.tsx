import { Pressable, Text } from "react-native";

import { fireEvent } from "@testing-library/react-native";
import { useColorScheme } from "nativewind";

import { createUserPreferences } from "@/test/mobile/fixtures/preferences";
import { renderMobile } from "@/test/mobile/render";

import { ThemeProvider, useTheme } from "./ThemeProvider";

const mockUpdatePreferences = jest.fn();
const mockUseUserPreferences = jest.fn();

jest.mock("@/ui/mobile/application/providers/UserPreferencesProvider", () => ({
  useUserPreferences: () => mockUseUserPreferences(),
}));

const ThemeConsumer = () => {
  const { isDark, mode, theme, setTheme, toggleTheme } = useTheme();

  return (
    <>
      <Text>{theme}</Text>
      <Text>{mode}</Text>
      <Text>{String(isDark)}</Text>
      <Pressable onPress={() => setTheme("dark")}>
        <Text>set-dark</Text>
      </Pressable>
      <Pressable onPress={toggleTheme}>
        <Text>toggle-theme</Text>
      </Pressable>
    </>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useColorScheme).mockReturnValue({
      colorScheme: "light",
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
    });
    mockUseUserPreferences.mockReturnValue({
      preferences: createUserPreferences(),
      updatePreferences: mockUpdatePreferences,
    });
  });

  it("throws when the hook is used outside the provider", () => {
    expect(() => renderMobile(<ThemeConsumer />)).toThrow(
      "useTheme must be used within ThemeProvider",
    );
  });

  it("uses the explicit stored theme preference", () => {
    const setColorScheme = jest.fn();
    jest.mocked(useColorScheme).mockReturnValue({
      colorScheme: "light",
      setColorScheme,
      toggleColorScheme: jest.fn(),
    });
    mockUseUserPreferences.mockReturnValue({
      preferences: createUserPreferences({ theme: "dark" }),
      updatePreferences: mockUpdatePreferences,
    });

    const screen = renderMobile(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getAllByText("dark")).toHaveLength(2);
    expect(screen.getByText("true")).toBeTruthy();
    expect(setColorScheme).toHaveBeenCalledWith("dark");
  });

  it("falls back to the native color scheme when preference is system", () => {
    jest.mocked(useColorScheme).mockReturnValue({
      colorScheme: "dark",
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
    });

    const screen = renderMobile(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText("system")).toBeTruthy();
    expect(screen.getByText("dark")).toBeTruthy();
    expect(screen.getByText("true")).toBeTruthy();
  });

  it("updates and toggles theme through preferences", () => {
    const screen = renderMobile(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByText("set-dark"));
    fireEvent.press(screen.getByText("toggle-theme"));

    expect(mockUpdatePreferences).toHaveBeenNthCalledWith(1, { theme: "dark" });
    expect(mockUpdatePreferences).toHaveBeenNthCalledWith(2, {
      theme: "dark",
    });
  });
});
