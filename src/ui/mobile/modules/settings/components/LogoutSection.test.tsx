import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { LogoutSection } from "./LogoutSection";

const mockSignOut = jest.fn();

jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signOut: mockSignOut,
  }),
}));

describe("LogoutSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signs the user out when pressed", () => {
    const screen = renderMobile(<LogoutSection />);

    fireEvent.press(screen.getByText("Log Out"));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
