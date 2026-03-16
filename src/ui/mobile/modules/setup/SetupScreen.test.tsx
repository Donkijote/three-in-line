import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { SetupScreen } from "./SetupScreen";

const mockSetHeader = jest.fn();
const mockToggleTheme = jest.fn();
const mockSignOut = jest.fn();
const mockUseTheme = jest.fn();

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => ({
    setHeader: mockSetHeader,
  }),
}));

jest.mock("@/ui/mobile/application/providers/ThemeProvider", () => ({
  useTheme: () => mockUseTheme(),
}));

jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signOut: mockSignOut,
  }),
}));

describe("SetupScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      mode: "dark",
      toggleTheme: mockToggleTheme,
    });
  });

  it("wires setup actions and renders the preview list", () => {
    const mockOnOpenMock = jest.fn();
    const screen = renderMobile(<SetupScreen onOpenMock={mockOnOpenMock} />);

    expect(mockSetHeader).toHaveBeenCalledWith({
      title: "Home",
      eyebrow: "Mobile Milestone",
    });
    expect(screen.getByText("Three In Line")).toBeTruthy();
    expect(screen.getByText("Preview Item 20")).toBeTruthy();

    fireEvent.press(screen.getByText("Open Mock Screen"));
    fireEvent.press(screen.getByText("Switch to Light Theme"));
    fireEvent.press(screen.getByText("Sign Out"));

    expect(mockOnOpenMock).toHaveBeenCalledTimes(1);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
