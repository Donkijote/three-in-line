import { ActivityIndicator } from "react-native";

import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { DisplayNameSection } from "./DisplayNameSection";

const mockUseDisplayNameSection = jest.fn();
const mockOnAcceptDisplayName = jest.fn();
const mockOnDisplayNameChanged = jest.fn();

jest.mock("@/ui/shared/settings/hooks/useDisplayNameSection", () => ({
  useDisplayNameSection: () => mockUseDisplayNameSection(),
}));

describe("DisplayNameSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates the display name and accepts valid changes", () => {
    mockUseDisplayNameSection.mockReturnValue({
      displayName: "PlayerOne",
      isBusy: false,
      isUpdating: false,
      onAcceptDisplayName: mockOnAcceptDisplayName,
      onDisplayNameChanged: mockOnDisplayNameChanged,
      shouldShowAccept: true,
      status: "available",
    });

    const screen = renderMobile(<DisplayNameSection />);

    fireEvent.changeText(
      screen.getByPlaceholderText("PixelMaster_99"),
      "PlayerTwo",
    );
    fireEvent.press(screen.getByText("Accept"));

    expect(mockOnDisplayNameChanged).toHaveBeenCalledWith("PlayerTwo");
    expect(mockOnAcceptDisplayName).toHaveBeenCalledTimes(1);
  });

  it("renders busy and error states from the shared view model", () => {
    mockUseDisplayNameSection.mockReturnValue({
      displayName: "PlayerOne",
      isBusy: true,
      isUpdating: false,
      onAcceptDisplayName: mockOnAcceptDisplayName,
      onDisplayNameChanged: mockOnDisplayNameChanged,
      shouldShowAccept: false,
      status: "taken",
    });

    const screen = renderMobile(<DisplayNameSection />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(screen.queryByText("Accept")).toBeNull();
  });
});
