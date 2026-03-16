import { fireEvent } from "@testing-library/react-native";
import { router, usePathname } from "expo-router";
import { Platform } from "react-native";

import { renderMobile } from "@/test/mobile/render";

import { NavBar } from "./NavBar";

const mockUseTheme = jest.fn();

jest.mock("@/ui/mobile/application/providers/ThemeProvider", () => ({
  useTheme: () => mockUseTheme(),
}));

describe("NavBar", () => {
  const originalPlatformOs = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as { OS: string }).OS = "ios";
    mockUseTheme.mockReturnValue({ isDark: false });
    jest.mocked(usePathname).mockReturnValue("/");
  });

  afterEach(() => {
    (Platform as { OS: string }).OS = originalPlatformOs;
  });

  it("renders the mobile navigation items and navigates on press", () => {
    const screen = renderMobile(<NavBar />);

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Play")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();

    fireEvent.press(screen.getByText("Play"));

    expect(router.replace).toHaveBeenCalledWith("/mock");
  });

  it("renders the android navigation shell", () => {
    (Platform as { OS: string }).OS = "android";
    jest.mocked(usePathname).mockReturnValue("/settings");

    const screen = renderMobile(<NavBar />);

    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("supports the dark iOS chrome", () => {
    mockUseTheme.mockReturnValue({ isDark: true });

    const screen = renderMobile(<NavBar />);

    expect(screen.getByText("Home")).toBeTruthy();
  });
});
