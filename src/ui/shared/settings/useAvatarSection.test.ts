import { act, renderHook, waitFor } from "@testing-library/react";

import type { User } from "@/domain/entities/User";

import { useAvatarSection } from "./useAvatarSection";

const baseUser: User = {
  id: "user-1",
  email: "ada@example.com",
  name: "Ada Lovelace",
};

describe("useAvatarSection", () => {
  it("resolves fallback initials", () => {
    const updateAvatar = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() =>
      useAvatarSection({
        currentUser: baseUser,
        updateAvatar,
      }),
    );

    expect(result.current.fallbackInitials).toBe("AL");
  });

  it("resolves preset avatar src", () => {
    const updateAvatar = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() =>
      useAvatarSection({
        currentUser: {
          ...baseUser,
          avatar: { type: "preset", value: "avatar-3" },
        },
        updateAvatar,
      }),
    );

    expect(result.current.avatarSrc).toBe("/avatars/avatar-3.svg");
  });

  it("updates avatar with preset id", async () => {
    const updateAvatar = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() =>
      useAvatarSection({
        currentUser: baseUser,
        updateAvatar,
      }),
    );

    await act(async () => {
      await result.current.onAcceptAvatar({
        id: "avatar-1",
        initials: "O",
        name: "Orion",
        src: "/avatars/avatar-1.svg",
      });
    });

    expect(updateAvatar).toHaveBeenCalledWith({
      avatar: { type: "preset", value: "avatar-1" },
    });
  });

  it("prevents duplicate updates while request is in flight", async () => {
    let resolveUpdate: ((value: unknown) => void) | undefined;
    const updateAvatar = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    const { result } = renderHook(() =>
      useAvatarSection({
        currentUser: baseUser,
        updateAvatar,
      }),
    );

    act(() => {
      void result.current.onAcceptAvatar({
        id: "avatar-1",
        initials: "O",
        name: "Orion",
        src: "/avatars/avatar-1.svg",
      });
      void result.current.onAcceptAvatar({
        id: "avatar-2",
        initials: "N",
        name: "Nova",
        src: "/avatars/avatar-2.svg",
      });
    });

    expect(updateAvatar).toHaveBeenCalledTimes(1);

    resolveUpdate?.({});

    await waitFor(() => {
      expect(result.current.isUpdating).toBe(false);
    });
  });

  it("logs errors and clears updating state on failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const updateAvatar = vi.fn().mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() =>
      useAvatarSection({
        currentUser: baseUser,
        updateAvatar,
      }),
    );

    await act(async () => {
      await result.current.onAcceptAvatar({
        id: "avatar-1",
        initials: "O",
        name: "Orion",
        src: "/avatars/avatar-1.svg",
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to update avatar",
      expect.any(Error),
    );
    expect(result.current.isUpdating).toBe(false);

    consoleSpy.mockRestore();
  });
});
