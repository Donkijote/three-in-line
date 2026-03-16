import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { PreviousAvatarsSection } from "./PreviousAvatarsSection";

const mockOnSelectPreviousAvatar = jest.fn();
const mockUsePreviousAvatarsSection = jest.fn();

jest.mock("@/ui/shared/settings/hooks/usePreviousAvatarsSection", () => ({
  usePreviousAvatarsSection: () => mockUsePreviousAvatarsSection(),
}));

describe("PreviousAvatarsSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePreviousAvatarsSection.mockReturnValue({
      isUpdating: false,
      onSelectPreviousAvatar: mockOnSelectPreviousAvatar,
      previousAvatars: [
        {
          key: "preset-avatar-1",
          initials: "O",
          isCurrent: true,
          src: "/avatars/avatar-1.svg",
          avatar: { type: "preset", value: "avatar-1" },
        },
      ],
    });
  });

  it("renders previous avatars and lets the user reselect one", () => {
    const screen = renderMobile(<PreviousAvatarsSection />);

    expect(screen.getByText("Previous Avatars")).toBeTruthy();
    expect(screen.getByLabelText("Add custom avatar")).toBeTruthy();

    fireEvent.press(screen.getByText("O"));

    expect(mockOnSelectPreviousAvatar).toHaveBeenCalledWith({
      type: "preset",
      value: "avatar-1",
    });
  });
});
