import * as SecureStore from "expo-secure-store";
import { Text } from "react-native";

import { initConvexClient } from "@/infrastructure/convex/client";
import { renderMobile } from "@/test/mobile/render";

import { ConvexProvider } from "./ConvexProvider";

const mockConvexAuthProvider = jest.fn();

jest.mock("expo-secure-store", () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

jest.mock("@/infrastructure/convex/client", () => ({
  initConvexClient: jest.fn(() => "convex-client"),
}));

jest.mock("@convex-dev/auth/react", () => {
  const React = require("react") as typeof import("react");

  return {
    ConvexAuthProvider: ({
      children,
      client,
      storage,
    }: {
      children: React.ReactNode;
      client: unknown;
      storage: {
        getItem: (key: string) => Promise<unknown>;
        removeItem: (key: string) => Promise<unknown>;
        setItem: (key: string, value: string) => Promise<unknown>;
      };
    }) => {
      mockConvexAuthProvider({ children, client, storage });
      return React.createElement(React.Fragment, null, children);
    },
  };
});

describe("ConvexProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_CONVEX_URL = "https://convex.example";
  });

  it("initializes the convex client and wires secure store token storage", async () => {
    const screen = renderMobile(
      <ConvexProvider>
        <Text>app</Text>
      </ConvexProvider>,
    );

    expect(screen.getByText("app")).toBeTruthy();
    expect(initConvexClient).toHaveBeenCalledWith("https://convex.example");

    const providerCall = mockConvexAuthProvider.mock.calls[0]?.[0];
    expect(providerCall.client).toBe("convex-client");

    await providerCall.storage.getItem("token");
    await providerCall.storage.setItem("token", "value");
    await providerCall.storage.removeItem("token");

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith("token");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("token", "value");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("token");
  });
});
