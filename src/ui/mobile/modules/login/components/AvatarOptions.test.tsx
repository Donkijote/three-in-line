import { fireEvent } from "@testing-library/react-native";

import type { AvatarPreset } from "@/ui/shared/avatars";
import { renderMobile } from "@/test/mobile/render";

import { AvatarOptions } from "./AvatarOptions";

const mockAvatarOptions: AvatarPreset[] = [
  {
    id: "avatar-1",
    name: "Orion",
    initials: "O",
    src: "/avatars/avatar-1.svg",
  },
  {
    id: "avatar-2",
    name: "Nova",
    initials: "N",
    src: "/avatars/avatar-2.svg",
  },
];

const mockExtraAvatar: AvatarPreset = {
  id: "avatar-99",
  name: "Custom",
  initials: "C",
  src: "/avatars/avatar-99.svg",
};

jest.mock("@/ui/shared/avatars", () => ({
  pickRandomPresetAvatars: () => mockAvatarOptions,
}));

jest.mock("@/ui/mobile/components/AvatarMoreOptions", () => {
  const React = require("react") as typeof import("react");
  const { Pressable, Text, View } = require("react-native") as typeof import("react-native");

  return {
    AvatarMoreOptions: ({
      children,
      onAccept,
    }: {
      children: React.ReactNode;
      onAccept: (avatar: AvatarPreset) => void;
    }) =>
      React.createElement(
        View,
        null,
        children,
        React.createElement(
          Pressable,
          { onPress: () => onAccept(mockExtraAvatar) },
          React.createElement(Text, null, "accept-extra-avatar"),
        ),
      ),
  };
});

describe("AvatarOptions", () => {
  it("updates the selected avatar from the list and the more-options flow", () => {
    const mockOnChange = jest.fn();
    const screen = renderMobile(<AvatarOptions onChange={mockOnChange} />);

    fireEvent.press(screen.getByLabelText("Select avatar Nova"));
    fireEvent.press(screen.getByText("accept-extra-avatar"));

    expect(mockOnChange).toHaveBeenNthCalledWith(1, mockAvatarOptions[1]);
    expect(mockOnChange).toHaveBeenNthCalledWith(2, mockExtraAvatar);
    expect(screen.getByText("CUSTOM")).toBeTruthy();
  });
});
