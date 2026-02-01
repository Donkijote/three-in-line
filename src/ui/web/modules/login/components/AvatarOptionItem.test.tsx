import { fireEvent, render, screen } from "@testing-library/react";

import type { AvatarPreset } from "@/ui/shared/avatars";

import { AvatarOptionItem } from "./AvatarOptionItem";

const avatar: AvatarPreset = {
  id: "avatar-1",
  name: "Orion",
  initials: "O",
  src: "/avatars/avatar-1.svg",
};

describe("AvatarOptionItem", () => {
  it("renders the avatar name and calls onSelect", () => {
    const onSelect = vi.fn();

    render(<AvatarOptionItem avatar={avatar} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "O Orion" }));

    expect(onSelect).toHaveBeenCalledWith(avatar);
  });
});
