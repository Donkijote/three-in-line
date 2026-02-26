import { act, renderHook, waitFor } from "@testing-library/react";

import { useDisplayNameSection } from "./useDisplayNameSection";

const checkUsernameExists = vi.fn();
const updateUsername = vi.fn();
let isChecking = false;
let currentUser: { username?: string; name?: string; email?: string } | null =
  null;
let lastDebouncedCallback: ((value: string) => void) | null = null;
let debouncedFn:
  | (((value: string) => void) & { cancel: ReturnType<typeof vi.fn> })
  | null = null;

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
};

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCheckUsernameExists: () => ({ checkUsernameExists, isChecking }),
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

describe("useDisplayNameSection", () => {
  beforeEach(() => {
    checkUsernameExists.mockReset();
    updateUsername.mockReset();
    currentUser = { username: "existing" };
    isChecking = false;
    lastDebouncedCallback = null;
    debouncedFn = null;
  });

  it("prefills current username and initial status", async () => {
    const { result } = renderHook(() => useDisplayNameSection());

    await waitFor(() => {
      expect(result.current.displayName).toBe("existing");
    });

    expect(result.current.status).toBe("available");
    expect(result.current.shouldShowAccept).toBe(false);
  });

  it("resets state for empty input and cancels debounced check", () => {
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("   ");
    });

    expect(debouncedFn?.cancel).toHaveBeenCalled();
    expect(checkUsernameExists).not.toHaveBeenCalled();
    expect(result.current.status).toBe("empty");
  });

  it("does not check availability for unchanged username", () => {
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("existing");
    });

    expect(debouncedFn?.cancel).toHaveBeenCalled();
    expect(checkUsernameExists).not.toHaveBeenCalled();
    expect(result.current.status).toBe("available");
    expect(result.current.shouldShowAccept).toBe(false);
  });

  it("marks username as available and enables accept", async () => {
    checkUsernameExists.mockResolvedValue(false);
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("newname");
    });

    await act(async () => {
      lastDebouncedCallback?.("newname");
      await Promise.resolve();
    });

    expect(checkUsernameExists).toHaveBeenCalledWith("newname");
    expect(result.current.status).toBe("available");
    expect(result.current.shouldShowAccept).toBe(true);
  });

  it("marks username as taken", async () => {
    checkUsernameExists.mockResolvedValue(true);
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("newname");
    });

    await act(async () => {
      lastDebouncedCallback?.("newname");
      await Promise.resolve();
    });

    expect(result.current.status).toBe("taken");
    expect(result.current.shouldShowAccept).toBe(false);
  });

  it("submits accepted username update", async () => {
    updateUsername.mockResolvedValue({});
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("newname");
    });

    await act(async () => {
      await result.current.onAcceptDisplayName();
    });

    expect(updateUsername).toHaveBeenCalledWith({ username: "newname" });
  });

  it("exposes busy state while updating", async () => {
    const deferred = createDeferred<unknown>();
    updateUsername.mockReturnValue(deferred.promise);
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("newname");
    });

    act(() => {
      void result.current.onAcceptDisplayName();
    });

    expect(result.current.isBusy).toBe(true);
    expect(result.current.isUpdating).toBe(true);

    await act(async () => {
      deferred.resolve({});
      await deferred.promise;
    });

    await waitFor(() => {
      expect(result.current.isBusy).toBe(false);
      expect(result.current.isUpdating).toBe(false);
    });
  });

  it("logs errors when username check fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    checkUsernameExists.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useDisplayNameSection());

    act(() => {
      result.current.onDisplayNameChanged("newname");
    });

    await act(async () => {
      lastDebouncedCallback?.("newname");
      await Promise.resolve();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to verify username",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("cancels debounced check on unmount", () => {
    const { unmount } = renderHook(() => useDisplayNameSection());
    unmount();

    expect(debouncedFn?.cancel).toHaveBeenCalled();
  });
});
