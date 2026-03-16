import { Text } from "react-native";

import { renderMobile } from "@/test/mobile/render";

import { AppProviders } from "./AppProviders";

const mockLayers: string[] = [];

jest.mock("@/ui/mobile/application/providers/ConvexProvider", () => {
  const React = require("react") as typeof import("react");

  return {
    ConvexProvider: ({ children }: { children: React.ReactNode }) => {
      mockLayers.push("convex");
      return React.createElement(React.Fragment, null, children);
    },
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = require("react") as typeof import("react");

  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => {
      mockLayers.push("safe-area");
      return React.createElement(React.Fragment, null, children);
    },
    SafeAreaView: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: jest.fn(() => ({
      top: 12,
      right: 0,
      bottom: 8,
      left: 0,
    })),
  };
});

jest.mock("@/ui/mobile/application/providers/UserPreferencesProvider", () => {
  const React = require("react") as typeof import("react");

  return {
    UserPreferencesProvider: ({ children }: { children: React.ReactNode }) => {
      mockLayers.push("preferences");
      return React.createElement(React.Fragment, null, children);
    },
  };
});

jest.mock("@/ui/mobile/application/providers/ThemeProvider", () => {
  const React = require("react") as typeof import("react");

  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => {
      mockLayers.push("theme");
      return React.createElement(React.Fragment, null, children);
    },
  };
});

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => {
  const React = require("react") as typeof import("react");

  return {
    MobileHeaderProvider: ({ children }: { children: React.ReactNode }) => {
      mockLayers.push("header");
      return React.createElement(React.Fragment, null, children);
    },
  };
});

describe("AppProviders", () => {
  beforeEach(() => {
    mockLayers.length = 0;
  });

  it("wraps children with the expected mobile provider stack", () => {
    const screen = renderMobile(
      <AppProviders>
        <Text>payload</Text>
      </AppProviders>,
    );

    expect(screen.getByText("payload")).toBeTruthy();
    expect(mockLayers).toEqual([
      "convex",
      "safe-area",
      "preferences",
      "theme",
      "header",
    ]);
  });
});
