import { ActivityIndicator } from "react-native";

import { renderMobile } from "@/test/mobile/render";

import { AvatarSection } from "./AvatarSection";

const mockUseAvatarSection = jest.fn();

jest.mock("@/ui/shared/settings/hooks/useAvatarSection", () => ({
  useAvatarSection: () => mockUseAvatarSection(),
}));

jest.mock("@/ui/mobile/components/AvatarMoreOptions", () => {
  const React = require("react") as typeof import("react");

  return {
    AvatarMoreOptions: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

describe("AvatarSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the current avatar fallback", () => {
    mockUseAvatarSection.mockReturnValue({
      avatarSrc: null,
      fallbackInitials: "JD",
      isUpdating: false,
      onAcceptAvatar: jest.fn(),
    });

    const screen = renderMobile(<AvatarSection />);

    expect(screen.getByText("JD")).toBeTruthy();
  });

  it("shows a loading overlay while the avatar is updating", () => {
    mockUseAvatarSection.mockReturnValue({
      avatarSrc: "/avatars/avatar-1.svg",
      fallbackInitials: "JD",
      isUpdating: true,
      onAcceptAvatar: jest.fn(),
    });

    const screen = renderMobile(<AvatarSection />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
