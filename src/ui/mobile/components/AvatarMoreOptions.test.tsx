import * as ReactNative from "react-native";

import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { AvatarMoreOptions } from "./AvatarMoreOptions";

jest.mock("@/ui/mobile/modules/login/components/AvatarOptionItem", () => {
  const React = require("react") as typeof import("react");
  const { Pressable, Text } =
    require("react-native") as typeof import("react-native");

  return {
    AvatarOptionItem: ({
      avatar,
      onSelect,
    }: {
      avatar: { name: string };
      onSelect: (avatar: { name: string }) => void;
    }) =>
      React.createElement(
        Pressable,
        {
          accessibilityLabel: `Select avatar ${avatar.name}`,
          onPress: () => onSelect(avatar),
        },
        React.createElement(Text, null, avatar.name),
      ),
  };
});

describe("AvatarMoreOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens the drawer, selects an avatar, and accepts it", () => {
    jest
      .spyOn(ReactNative, "useWindowDimensions")
      .mockReturnValue({ width: 390, height: 844, scale: 2, fontScale: 1 });

    const mockOnAccept = jest.fn();
    const screen = renderMobile(
      <AvatarMoreOptions onAccept={mockOnAccept}>
        <ReactNative.Text>open-avatars</ReactNative.Text>
      </AvatarMoreOptions>,
    );

    fireEvent.press(screen.getByText("open-avatars"));
    fireEvent.press(screen.getByLabelText("Select avatar Orion"));
    fireEvent.press(screen.getByText("Accept"));

    expect(mockOnAccept).toHaveBeenCalledWith(
      expect.objectContaining({ id: "avatar-1", name: "Orion" }),
    );
  });

  it("supports closing the avatar list without accepting", () => {
    jest
      .spyOn(ReactNative, "useWindowDimensions")
      .mockReturnValue({ width: 1024, height: 844, scale: 2, fontScale: 1 });

    const mockOnAccept = jest.fn();
    const screen = renderMobile(
      <AvatarMoreOptions onAccept={mockOnAccept}>
        <ReactNative.Text>open-avatars</ReactNative.Text>
      </AvatarMoreOptions>,
    );

    fireEvent.press(screen.getByText("open-avatars"));
    fireEvent.press(screen.getByLabelText("Close avatar list"));

    expect(mockOnAccept).not.toHaveBeenCalled();
  });

  it("keeps the drawer closed when the trigger is disabled", () => {
    jest
      .spyOn(ReactNative, "useWindowDimensions")
      .mockReturnValue({ width: 390, height: 844, scale: 2, fontScale: 1 });

    const screen = renderMobile(
      <AvatarMoreOptions disabled onAccept={jest.fn()}>
        <ReactNative.Text>open-avatars</ReactNative.Text>
      </AvatarMoreOptions>,
    );

    fireEvent.press(screen.getByText("open-avatars"));

    expect(screen.queryByLabelText("Select avatar Orion")).toBeNull();
  });
});
