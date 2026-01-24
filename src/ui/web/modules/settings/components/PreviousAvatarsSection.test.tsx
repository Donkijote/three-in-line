import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { PreviousAvatarsSection } from "./PreviousAvatarsSection";

const updateAvatar = vi.fn();
let currentUser: {
  name?: string;
  username?: string;
  email?: string;
  avatars?: Array<{ type: "custom" | "preset" | "generated"; value: string }>;
} | null = null;

vi.mock("@/infrastructure/convex/UserApi", () => ({
  useCurrentUser: () => currentUser,
  useUpdateAvatar: () => updateAvatar,
}));

describe("PreviousAvatarsSection", () => {
  beforeEach(() => {
    updateAvatar.mockReset();
    currentUser = {
      name: "Ada Lovelace",
      email: "ada@example.com",
      avatars: [
        { type: "preset", value: "avatar-1" },
        { type: "custom", value: "custom-url" },
      ],
    };
  });

  it("renders previous avatars", () => {
    render(<PreviousAvatarsSection />);

    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("updates avatar when a previous one is selected", async () => {
    updateAvatar.mockResolvedValue({});

    render(<PreviousAvatarsSection />);

    fireEvent.click(screen.getByText("O"));

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

    render(<PreviousAvatarsSection />);

    fireEvent.click(screen.getByText("O"));
    fireEvent.click(screen.getByText("O"));

    expect(updateAvatar).toHaveBeenCalledTimes(1);

    // @ts-expect-error: only for testing purposes
    resolveUpdate?.();

    await waitFor(() => {
      expect(updateAvatar).toHaveBeenCalledTimes(1);
    });
  });

  it("handles update failures", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    updateAvatar.mockRejectedValue(new Error("boom"));

    render(<PreviousAvatarsSection />);

    fireEvent.click(screen.getByText("O"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to update avatar",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
