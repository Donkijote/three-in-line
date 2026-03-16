import { Platform, Text } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { renderMobile } from "@/test/mobile/render";

import { Header } from "./Header";

describe("Header", () => {
  const originalPlatformOs = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as { OS: string }).OS = "ios";
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      top: 20,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });

  afterEach(() => {
    (Platform as { OS: string }).OS = originalPlatformOs;
  });

  it("renders the title, eyebrow, and optional left slot", () => {
    const screen = renderMobile(
      <Header
        title="Home"
        eyebrow="Mission Logs"
        leftSlot={<Text>back</Text>}
      />,
    );

    expect(screen.getByText("Mission Logs")).toBeTruthy();
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("back")).toBeTruthy();
  });

  it("renders the android fallback chrome without optional content", () => {
    (Platform as { OS: string }).OS = "android";

    const screen = renderMobile(<Header title="Settings" />);

    expect(screen.getByText("Settings")).toBeTruthy();
    expect(screen.queryByText("Mission Logs")).toBeNull();
    expect(screen.queryByText("back")).toBeNull();
  });
});
