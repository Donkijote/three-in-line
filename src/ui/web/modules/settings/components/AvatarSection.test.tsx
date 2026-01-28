import type { ReactNode } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AvatarSection } from "./AvatarSection";

const updateAvatar = vi.fn();
let currentUser: {
  name?: string;
  username?: string;
  email?: string;
  avatar?: { type: "preset" | "custom" | "generated"; value: string };
} | null = null;

vi.mock("@/ui/web/hooks/useUser", () => ({
  useCurrentUser: () => currentUser,
  useUpdateAvatar: () => updateAvatar,
}));

vi.mock("@/ui/web/components/AvatarMoreOptions", () => ({
  AvatarMoreOptions: ({
    onAccept,
    children,
  }: {
    onAccept: (avatar: { id: string }) => void;
    children: ReactNode;
  }) => (
    <div>
      {children}
      <button type="button" onClick={() => onAccept({ id: "avatar-1" })}>
        AcceptAvatar
      </button>
    </div>
  ),
}));

describe("AvatarSection", () => {
  beforeEach(() => {
    updateAvatar.mockReset();
    currentUser = { name: "Ada Lovelace", email: "ada@example.com" };
  });

  it("renders fallback initials", () => {
    render(<AvatarSection />);

    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("updates avatar when an option is accepted", async () => {
    updateAvatar.mockResolvedValue({});

    render(<AvatarSection />);

    fireEvent.click(screen.getByRole("button", { name: "AcceptAvatar" }));

    await waitFor(() => {
      expect(updateAvatar).toHaveBeenCalledWith({
        avatar: { type: "preset", value: "avatar-1" },
      });
    });
  });

  it("skips updates while already updating", async () => {
    let resolveUpdate: (value: PromiseLike<unknown> | unknown) => void;
    updateAvatar.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(<AvatarSection />);

    fireEvent.click(screen.getByRole("button", { name: "AcceptAvatar" }));
    fireEvent.click(screen.getByRole("button", { name: "AcceptAvatar" }));

    expect(updateAvatar).toHaveBeenCalledTimes(1);

    // @ts-expect-error: only for testing purposes
    resolveUpdate?.();

    await waitFor(() => {
      expect(updateAvatar).toHaveBeenCalledTimes(1);
    });
  });

  it("logs failures when updating avatar fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    updateAvatar.mockRejectedValueOnce(new Error("boom"));

    render(<AvatarSection />);

    fireEvent.click(screen.getByRole("button", { name: "AcceptAvatar" }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to update avatar",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
