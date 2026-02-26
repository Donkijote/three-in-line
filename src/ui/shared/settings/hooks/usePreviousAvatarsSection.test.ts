import { act, renderHook, waitFor } from "@testing-library/react";

import type { UserAvatar } from "@/domain/entities/Avatar";
import type { User } from "@/domain/entities/User";

import { usePreviousAvatarsSection } from "./usePreviousAvatarsSection";

const baseUser: User = {
  avatars: [
    { type: "preset", value: "avatar-1" },
    { type: "custom", value: "custom-url" },
  ] as UserAvatar[],
  email: "ada@example.com",
  id: "user-1",
  name: "Ada Lovelace",
};

const { useCurrentUserMock, useUpdateAvatarMock } = vi.hoisted(() => ({
  useCurrentUserMock: vi.fn(),
  useUpdateAvatarMock: vi.fn(),
}));

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: useCurrentUserMock,
  useUpdateAvatar: useUpdateAvatarMock,
}));

describe("usePreviousAvatarsSection", () => {
  beforeEach(() => {
    useCurrentUserMock.mockReset();
    useUpdateAvatarMock.mockReset();
    useCurrentUserMock.mockReturnValue(baseUser);
  });

  it("maps previous avatars with preset and fallback values", () => {
    useUpdateAvatarMock.mockReturnValue(vi.fn().mockResolvedValue({}));

    const { result } = renderHook(() => usePreviousAvatarsSection());

    expect(result.current.previousAvatars).toEqual([
      expect.objectContaining({
        initials: "O",
        isCurrent: true,
        key: "preset-avatar-1",
        src: "/avatars/avatar-1.svg",
      }),
      expect.objectContaining({
        initials: "AL",
        isCurrent: false,
        key: "custom-custom-url",
        src: "custom-url",
      }),
    ]);
  });

  it("updates avatar when selecting a previous avatar", async () => {
    const updateAvatar = vi.fn().mockResolvedValue({});
    useUpdateAvatarMock.mockReturnValue(updateAvatar);

    const { result } = renderHook(() => usePreviousAvatarsSection());

    await act(async () => {
      await result.current.onSelectPreviousAvatar({
        type: "preset",
        value: "avatar-1",
      });
    });

    expect(updateAvatar).toHaveBeenCalledWith({
      avatar: { type: "preset", value: "avatar-1" },
    });
  });

  it("skips updates while already updating", async () => {
    let resolveUpdate: (value: PromiseLike<unknown> | unknown) => void;
    const updateAvatar = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );
    useUpdateAvatarMock.mockReturnValue(updateAvatar);

    const { result } = renderHook(() => usePreviousAvatarsSection());

    act(() => {
      void result.current.onSelectPreviousAvatar({
        type: "preset",
        value: "avatar-1",
      });
    });
    act(() => {
      void result.current.onSelectPreviousAvatar({
        type: "preset",
        value: "avatar-1",
      });
    });

    expect(updateAvatar).toHaveBeenCalledTimes(1);

    // @ts-expect-error: set in deferred mock
    resolveUpdate?.({});

    await waitFor(() => {
      expect(result.current.isUpdating).toBe(false);
    });
  });

  it("logs failures when update avatar fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const updateAvatar = vi.fn().mockRejectedValue(new Error("boom"));
    useUpdateAvatarMock.mockReturnValue(updateAvatar);

    const { result } = renderHook(() => usePreviousAvatarsSection());

    await act(async () => {
      await result.current.onSelectPreviousAvatar({
        type: "preset",
        value: "avatar-1",
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to update avatar",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
