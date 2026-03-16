import { Text } from "react-native";

import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { renderMobile } from "@/test/mobile/render";

import { AppLayout } from "./AppLayout";

const mockUseTheme = jest.fn();
const mockUseMobileHeader = jest.fn();

jest.mock("@/ui/mobile/application/providers/ThemeProvider", () => ({
  useTheme: () => mockUseTheme(),
}));

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => mockUseMobileHeader(),
}));

jest.mock("@/ui/mobile/components/Header", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    Header: createTextStub(({ title }: { title: string }) => `header:${title}`),
  };
});

jest.mock("@/ui/mobile/layout/components/NavBar", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    NavBar: createTextStub("mobile-nav"),
  };
});

jest.mock("@/ui/mobile/components/ui/scroll-area", () => {
  const React = require("react") as typeof import("react");
  const { View } = require("react-native") as typeof import("react-native");

  return {
    ScrollArea: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, null, children),
  };
});

describe("AppLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      top: 12,
      right: 0,
      bottom: 8,
      left: 0,
    });
    mockUseTheme.mockReturnValue({ isDark: false });
    mockUseMobileHeader.mockReturnValue({
      header: { title: "Home", eyebrow: "Mission Logs" },
    });
  });

  it("shows the header and nav chrome outside the login route", () => {
    jest.mocked(usePathname).mockReturnValue("/");

    const screen = renderMobile(
      <AppLayout>
        <Text>content</Text>
      </AppLayout>,
    );

    expect(screen.getByText("header:Home")).toBeTruthy();
    expect(screen.getByText("mobile-nav")).toBeTruthy();
    expect(screen.getByText("content")).toBeTruthy();
  });

  it("hides the mobile chrome on the login route", () => {
    jest.mocked(usePathname).mockReturnValue("/login");

    const screen = renderMobile(
      <AppLayout>
        <Text>content</Text>
      </AppLayout>,
    );

    expect(screen.queryByText("header:Home")).toBeNull();
    expect(screen.queryByText("mobile-nav")).toBeNull();
    expect(screen.getByText("content")).toBeTruthy();
  });

  it("keeps the nav visible without a header and renders dark theme layout tokens", () => {
    jest.mocked(usePathname).mockReturnValue("/");
    mockUseTheme.mockReturnValue({ isDark: true });
    mockUseMobileHeader.mockReturnValue({ header: null });

    const screen = renderMobile(
      <AppLayout>
        <Text>content</Text>
      </AppLayout>,
    );

    expect(screen.queryByText("header:Home")).toBeNull();
    expect(screen.getByText("mobile-nav")).toBeTruthy();
    expect(screen.getByText("content")).toBeTruthy();
  });
});
