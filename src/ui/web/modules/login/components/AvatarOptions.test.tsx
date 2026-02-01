import type { ReactNode } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import type { AvatarPreset } from "@/ui/shared/avatars";

import { AvatarOptions } from "./AvatarOptions";

const avatars: AvatarPreset[] = [
  { id: "avatar-1", name: "Orion", initials: "O", src: "/a-1.svg" },
  { id: "avatar-2", name: "Nova", initials: "N", src: "/a-2.svg" },
];

vi.mock("@/ui/shared/avatars", () => ({
  pickRandomPresetAvatars: () => avatars,
}));

vi.mock("@/ui/web/components/AvatarMoreOptions", () => ({
  AvatarMoreOptions: ({
    children,
    onAccept,
  }: {
    children: ReactNode;
    onAccept: (avatar: AvatarPreset) => void;
  }) => (
    <div>
      {children}
      <button
        type="button"
        onClick={() =>
          onAccept({
            id: "avatar-3",
            name: "Atlas",
            initials: "A",
            src: "/a-3.svg",
          })
        }
      >
        Accept avatar
      </button>
    </div>
  ),
}));

describe("AvatarOptions", () => {
  it("renders avatar options and calls onChange when selected", () => {
    const onChange = vi.fn();

    render(<AvatarOptions onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "N Nova" }));

    expect(onChange).toHaveBeenCalledWith(avatars[1]);
  });

  it("shows the custom avatar option", () => {
    const onChange = vi.fn();

    render(<AvatarOptions onChange={onChange} />);

    expect(screen.getByRole("button", { name: "CUSTOM" })).toBeInTheDocument();
  });

  it("replaces the first option when a new avatar is accepted", () => {
    const onChange = vi.fn();

    render(<AvatarOptions onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Accept avatar" }));

    expect(onChange).toHaveBeenCalledWith({
      id: "avatar-3",
      name: "Atlas",
      initials: "A",
      src: "/a-3.svg",
    });
    expect(screen.getByRole("button", { name: /Atlas/ })).toBeInTheDocument();
  });
});
