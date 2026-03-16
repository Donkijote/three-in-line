import { renderMobile } from "@/test/mobile/render";

import { SettingsScreen } from "./SettingsScreen";

const mockSetHeader = jest.fn();

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => ({
    setHeader: mockSetHeader,
  }),
}));

jest.mock("@/ui/mobile/modules/settings/components/AvatarSection", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    AvatarSection: createTextStub("avatar-section"),
  };
});

jest.mock("@/ui/mobile/modules/settings/components/DisplayNameSection", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    DisplayNameSection: createTextStub("display-name-section"),
  };
});

jest.mock(
  "@/ui/mobile/modules/settings/components/PreviousAvatarsSection",
  () => {
    const { createTextStub } = require("@/test/mobile/componentMocks");

    return {
      PreviousAvatarsSection: createTextStub("previous-avatars-section"),
    };
  },
);

jest.mock("@/ui/mobile/modules/settings/components/PreferencesSection", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    PreferencesSection: createTextStub("preferences-section"),
  };
});

jest.mock("@/ui/mobile/modules/settings/components/LogoutSection", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    LogoutSection: createTextStub("logout-section"),
  };
});

jest.mock("@/ui/mobile/modules/settings/components/VersionInfo", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    VersionInfo: createTextStub("version-info"),
  };
});

describe("SettingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets the header and renders each settings section", () => {
    const screen = renderMobile(<SettingsScreen />);

    expect(mockSetHeader).toHaveBeenCalledWith({ title: "Settings" });
    expect(screen.getByText("avatar-section")).toBeTruthy();
    expect(screen.getByText("display-name-section")).toBeTruthy();
    expect(screen.getByText("previous-avatars-section")).toBeTruthy();
    expect(screen.getByText("preferences-section")).toBeTruthy();
    expect(screen.getByText("logout-section")).toBeTruthy();
    expect(screen.getByText("version-info")).toBeTruthy();
  });

  it("clears the header on unmount", () => {
    const screen = renderMobile(<SettingsScreen />);

    screen.unmount();

    expect(mockSetHeader).toHaveBeenLastCalledWith(null);
  });
});
