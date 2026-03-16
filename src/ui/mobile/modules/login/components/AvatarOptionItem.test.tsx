import { fireEvent } from "@testing-library/react-native";

import { getPresetAvatarById } from "@/ui/shared/avatars";
import { renderMobile } from "@/test/mobile/render";

import { AvatarOptionItem } from "./AvatarOptionItem";

describe("AvatarOptionItem", () => {
  it("selects a preset avatar", () => {
    const mockOnSelect = jest.fn();
    const avatar = getPresetAvatarById("avatar-1");
    const screen = renderMobile(
      <AvatarOptionItem
        avatar={avatar}
        isSelected={false}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.press(screen.getByLabelText(`Select avatar ${avatar.name}`));

    expect(mockOnSelect).toHaveBeenCalledWith(avatar);
    expect(screen.getByText(avatar.name)).toBeTruthy();
  });

  it("renders the custom avatar option state", () => {
    const avatar = getPresetAvatarById("avatar-2");
    const screen = renderMobile(
      <AvatarOptionItem
        avatar={avatar}
        isSelected
        isCustom
        onSelect={jest.fn()}
      />,
    );

    expect(screen.getByText(avatar.name)).toBeTruthy();
    expect(
      screen.getByLabelText(`Select avatar ${avatar.name}`),
    ).toBeTruthy();
  });
});
