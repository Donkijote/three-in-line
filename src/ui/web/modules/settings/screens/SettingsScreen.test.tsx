import { render, screen } from "@testing-library/react";

import { SettingsScreen } from "./SettingsScreen";

vi.mock("@/ui/web/modules/settings/components/AvatarSection", () => ({
  AvatarSection: () => <div data-testid="avatar-section" />,
}));
vi.mock("@/ui/web/modules/settings/components/DisplayNameSection", () => ({
  DisplayNameSection: () => <div data-testid="display-name-section" />,
}));
vi.mock("@/ui/web/modules/settings/components/PreviousAvatarsSection", () => ({
  PreviousAvatarsSection: () => <div data-testid="previous-avatars-section" />,
}));
vi.mock("@/ui/web/modules/settings/components/PreferencesSection", () => ({
  PreferencesSection: () => <div data-testid="preferences-section" />,
}));
vi.mock("@/ui/web/modules/settings/components/LogoutButton", () => ({
  LogoutButton: () => <div data-testid="logout-button" />,
}));
vi.mock("@/ui/web/modules/settings/components/VersionInfo", () => ({
  VersionInfo: () => <div data-testid="version-info" />,
}));

describe("SettingsScreen", () => {
  it("renders the settings layout and sections", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-section")).toBeInTheDocument();
    expect(screen.getByTestId("display-name-section")).toBeInTheDocument();
    expect(screen.getByTestId("previous-avatars-section")).toBeInTheDocument();
    expect(screen.getByTestId("preferences-section")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("version-info")).toBeInTheDocument();
  });
});
