import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { MockScreen } from "./MockScreen";

const mockSetHeader = jest.fn();

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => ({
    setHeader: mockSetHeader,
  }),
}));

describe("MockScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets a header and supports going back from both actions", () => {
    const mockOnGoBack = jest.fn();
    const screen = renderMobile(<MockScreen onGoBack={mockOnGoBack} />);

    expect(mockSetHeader).toHaveBeenCalledWith({
      title: "Mock",
      leftSlot: expect.any(Object),
    });
    expect(screen.getByText("Mock Screen")).toBeTruthy();

    fireEvent.press(screen.getByText("Go Back"));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);

    screen.unmount();

    expect(mockSetHeader).toHaveBeenLastCalledWith(null);
  });
});
