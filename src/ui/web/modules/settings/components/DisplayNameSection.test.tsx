import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { DisplayNameSection } from "./DisplayNameSection";

const checkUsernameExists = vi.fn();
const updateUsername = vi.fn();
let currentUser: { username?: string; name?: string; email?: string } | null =
  null;
let lastDebouncedCallback: ((value: string) => void) | null = null;
let debouncedFn:
  | (((value: string) => void) & { cancel: ReturnType<typeof vi.fn> })
  | null = null;

vi.mock("@/infrastructure/convex/UserApi", () => ({
  useCheckUsernameExists: () => ({ checkUsernameExists, isChecking: false }),
  useCurrentUser: () => currentUser,
  useUpdateUsername: () => updateUsername,
}));

vi.mock("use-debounce", () => ({
  useDebouncedCallback: (callback: (value: string) => void) => {
    lastDebouncedCallback = callback;
    if (!debouncedFn) {
      const cancel = vi.fn();
      const debounced = () => undefined;
      debounced.cancel = cancel;
      debouncedFn = debounced as unknown as typeof debouncedFn;
    }
    return debouncedFn;
  },
}));

describe("DisplayNameSection", () => {
  beforeEach(() => {
    checkUsernameExists.mockReset();
    updateUsername.mockReset();
    currentUser = { username: "existing" };
    debouncedFn = null;
    lastDebouncedCallback = null;
  });

  it("prefills the current username", () => {
    render(<DisplayNameSection />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    return waitFor(() => {
      expect(input).toHaveValue("existing");
    });
  });

  it("does not check availability for the same username on change", () => {
    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "existing" },
    });

    expect(checkUsernameExists).not.toHaveBeenCalled();
  });

  it("resets availability when the input is cleared", () => {
    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: " " },
    });

    expect(debouncedFn?.cancel).toHaveBeenCalled();
    expect(checkUsernameExists).not.toHaveBeenCalled();
  });

  it("handles empty username checks", async () => {
    render(<DisplayNameSection />);

    await act(async () => {
      lastDebouncedCallback?.("   ");
    });

    expect(checkUsernameExists).not.toHaveBeenCalled();
  });

  it("marks availability as false when the check matches the current username", async () => {
    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "newname" },
    });

    await act(async () => {
      lastDebouncedCallback?.("existing");
    });

    expect(checkUsernameExists).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Accept", hidden: true }),
    ).not.toHaveAttribute("hidden");
  });

  it("skips checking when typing the current username", () => {
    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "existing " },
    });

    expect(debouncedFn?.cancel).toHaveBeenCalled();
    expect(checkUsernameExists).not.toHaveBeenCalled();
  });

  it("checks availability and accepts a new username", async () => {
    checkUsernameExists.mockResolvedValue(false);
    updateUsername.mockResolvedValue({});

    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "newname" },
    });

    await act(async () => {
      await act(async () => {
        lastDebouncedCallback?.("newname");
      });
    });

    const acceptButton = await screen.findByRole("button", {
      name: "Accept",
      hidden: true,
    });
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(updateUsername).toHaveBeenCalledWith({ username: "newname" });
    });
  });

  it("disables the input while saving", async () => {
    checkUsernameExists.mockResolvedValue(false);
    let resolveUpdate: (value: PromiseLike<unknown> | unknown) => void;
    updateUsername.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "newname" },
    });

    await act(async () => {
      lastDebouncedCallback?.("newname");
    });

    const acceptButton = await screen.findByRole("button", {
      name: "Accept",
      hidden: true,
    });
    fireEvent.click(acceptButton);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(document.querySelector("svg.animate-spin")).toBeTruthy();

    await act(async () => {
      resolveUpdate?.(null);
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });
  });

  it("logs when updating username fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    checkUsernameExists.mockResolvedValue(false);
    updateUsername.mockRejectedValueOnce(new Error("boom"));

    render(<DisplayNameSection />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "newname" },
    });

    await act(async () => {
      lastDebouncedCallback?.("newname");
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Accept", hidden: true }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to update username",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("logs when checking username fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    checkUsernameExists.mockRejectedValueOnce(new Error("boom"));

    render(<DisplayNameSection />);

    await act(async () => {
      lastDebouncedCallback?.("newname");
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to verify username",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
