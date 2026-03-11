import { renderHook } from "@testing-library/react";

import { useHomeMatchCard } from "./useHomeMatchCard";

const useCurrentUserMock = vi.fn();
const useUserByIdMock = vi.fn();

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: () => useCurrentUserMock(),
  useUserById: (userId?: string | null) => useUserByIdMock(userId),
}));

describe("useHomeMatchCard", () => {
  beforeEach(() => {
    useCurrentUserMock.mockReset();
    useUserByIdMock.mockReset();
  });

  it("builds the match card view model from current and opponent users", () => {
    useCurrentUserMock.mockReturnValue({
      id: "user-1",
      username: "you",
      avatar: { type: "preset", value: "avatar-1" },
    });
    useUserByIdMock.mockReturnValue({
      id: "user-2",
      username: "rival",
      avatar: { type: "preset", value: "avatar-2" },
    });

    const { result } = renderHook(() => useHomeMatchCard("user-2"));

    expect(result.current).toEqual({
      currentAvatar: "/avatars/avatar-1.svg",
      currentInitials: "YO",
      currentName: "you",
      opponentAvatar: "/avatars/avatar-2.svg",
      opponentInitials: "RI",
      opponentName: "rival",
    });
  });

  it("falls back cleanly when user records are missing", () => {
    useCurrentUserMock.mockReturnValue(null);
    useUserByIdMock.mockReturnValue(null);

    const { result } = renderHook(() => useHomeMatchCard(null));

    expect(result.current).toEqual({
      currentAvatar: undefined,
      currentInitials: "?",
      currentName: "You",
      opponentAvatar: undefined,
      opponentInitials: "?",
      opponentName: "Opponent",
    });
  });
});
