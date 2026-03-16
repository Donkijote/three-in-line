/// <reference types="jest" />

import "react-native-gesture-handler/jestSetup";

jest.mock("react-native-reanimated");
jest.mock("nativewind");
jest.mock("expo-router");
jest.mock("expo-linear-gradient");
jest.mock("expo-blur");
jest.mock("expo-status-bar");
jest.mock("react-native-safe-area-context");
jest.mock("react-native-svg");
jest.mock("lucide-react-native");

process.env.EXPO_PUBLIC_PUBLIC_ASSETS_URL = "https://assets.example.com";

const failOnUnexpectedConsole = (
  method: "error" | "warn",
  args: unknown[],
) => {
  const message = args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }

      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(" ");

  throw new Error(`Unexpected console.${method}: ${message}`);
};

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    failOnUnexpectedConsole("error", args);
  });
  jest.spyOn(console, "warn").mockImplementation((...args) => {
    failOnUnexpectedConsole("warn", args);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
