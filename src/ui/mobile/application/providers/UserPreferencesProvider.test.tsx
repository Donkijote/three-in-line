import { Text } from "react-native";

import { userPreferencesSecureStoreRepository } from "@/infrastructure/mobile/storage/userPreferencesSecureStore";
import { renderMobile } from "@/test/mobile/render";

import { UserPreferencesProvider } from "./UserPreferencesProvider";

const mockSharedProvider = jest.fn();

jest.mock("@/ui/shared/preferences/providers/UserPreferencesProvider", () => {
  const React = require("react") as typeof import("react");

  return {
    UserPreferencesProvider: ({
      children,
      repository,
    }: {
      children: React.ReactNode;
      repository: unknown;
    }) => {
      mockSharedProvider(repository);
      return React.createElement(React.Fragment, null, children);
    },
    useUserPreferences: jest.fn(),
  };
});

describe("UserPreferencesProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the mobile secure store repository", () => {
    const screen = renderMobile(
      <UserPreferencesProvider>
        <Text>preferences</Text>
      </UserPreferencesProvider>,
    );

    expect(screen.getByText("preferences")).toBeTruthy();
    expect(mockSharedProvider).toHaveBeenCalledWith(
      userPreferencesSecureStoreRepository,
    );
  });
});
