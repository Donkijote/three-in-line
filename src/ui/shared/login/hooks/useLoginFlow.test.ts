import { beforeEach, describe, expect, it, vi } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { useLoginFlow } from "@/ui/shared/login/hooks/useLoginFlow";
import type { LoginFormValues } from "@/ui/shared/login/types/login";

const signIn = vi.fn();
const checkEmailExists = vi.fn();
let isChecking = false;

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signIn }),
}));

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCheckEmailExists: () => ({
    checkEmailExists,
    isChecking,
  }),
}));

const getDefaultValues = (): LoginFormValues => ({
  email: "",
  password: "",
  flow: "",
});

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

describe("useLoginFlow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    signIn.mockReset();
    checkEmailExists.mockReset();
    isChecking = false;
  });

  it("debounces valid email checks", async () => {
    checkEmailExists.mockResolvedValue(true);

    const { result } = renderHook(() => useLoginFlow());

    act(() => {
      result.current.onEmailChanged("player@example.com");
      vi.advanceTimersByTime(599);
    });

    expect(checkEmailExists).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(1);
      await Promise.resolve();
    });

    expect(checkEmailExists).toHaveBeenCalledWith("player@example.com");
  });

  it("resets when email is invalid", () => {
    const { result } = renderHook(() => useLoginFlow());

    act(() => {
      result.current.onEmailChanged("invalid");
      vi.runAllTimers();
    });

    expect(result.current.doesEmailExist).toBeNull();
    expect(checkEmailExists).not.toHaveBeenCalled();
  });

  it("syncs existence to sign-in flow", async () => {
    checkEmailExists.mockResolvedValue(true);

    const { result } = renderHook(() => useLoginFlow());

    act(() => {
      result.current.onEmailChanged("player@example.com");
      vi.runAllTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.form.state.values.flow).toBe("signIn");
  });

  it("syncs existence to sign-up flow", async () => {
    checkEmailExists.mockResolvedValue(false);

    const { result } = renderHook(() => useLoginFlow());

    act(() => {
      result.current.onEmailChanged("new@example.com");
      vi.runAllTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.form.state.values.flow).toBe("signUp");
  });

  it("submits sign-in payload", async () => {
    const { result } = renderHook(() => useLoginFlow());

    await act(async () => {
      await result.current.submit({
        email: "player@example.com",
        password: "secret",
        flow: "signIn",
      });
    });

    expect(signIn).toHaveBeenCalledWith("password", {
      email: "player@example.com",
      password: "secret",
      flow: "signIn",
    });
  });

  it("submits sign-up payload", async () => {
    const { result } = renderHook(() => useLoginFlow());

    await act(async () => {
      await result.current.submit({
        ...getDefaultValues(),
        email: "new@example.com",
        password: "secret",
        flow: "signUp",
        avatar: { type: "preset", value: "avatar-1" },
      });
    });

    expect(signIn).toHaveBeenCalledWith("password", {
      email: "new@example.com",
      password: "secret",
      flow: "signUp",
      avatar: { type: "preset", value: "avatar-1" },
    });
  });

  it("stores auth error when submit fails", async () => {
    const error = new Error("boom");
    signIn.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLoginFlow());

    await act(async () => {
      await result.current.submit({
        email: "player@example.com",
        password: "secret",
        flow: "signIn",
      });
    });

    expect(result.current.authError).toBe(error);
    consoleError.mockRestore();
  });

  it("maps string submit errors to Error instances", async () => {
    signIn.mockRejectedValue("bad credentials");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLoginFlow());

    await act(async () => {
      await result.current.submit({
        email: "player@example.com",
        password: "secret",
        flow: "signIn",
      });
    });

    expect(result.current.authError).toBeInstanceOf(Error);
    expect((result.current.authError as Error).message).toBe("bad credentials");
    consoleError.mockRestore();
  });

  it("uses fallback auth error message for unknown submit errors", async () => {
    signIn.mockRejectedValue({ reason: "unknown" });
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLoginFlow());

    await act(async () => {
      await result.current.submit({
        email: "player@example.com",
        password: "secret",
        flow: "signIn",
      });
    });

    expect(result.current.authError).toBeInstanceOf(Error);
    expect((result.current.authError as Error).message).toBe(
      "We couldn't get you into the arena. Try again.",
    );
    consoleError.mockRestore();
  });

  it("reports pending check state", () => {
    checkEmailExists.mockImplementation(
      () => new Promise<boolean>(() => undefined),
    );

    const { result } = renderHook(() => useLoginFlow());

    act(() => {
      result.current.onEmailChanged("player@example.com");
    });

    expect(result.current.isEmailCheckPending("player@example.com")).toBe(true);
  });

  it("ignores stale failures from previous email-check requests", async () => {
    const first = createDeferred<boolean>();
    const second = createDeferred<boolean>();
    checkEmailExists
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLoginFlow());

    act(() => {
      result.current.onEmailChanged("old@example.com");
      vi.runAllTimers();
    });

    act(() => {
      result.current.onEmailChanged("new@example.com");
      vi.runAllTimers();
    });

    await act(async () => {
      first.reject(new Error("stale failure"));
      await Promise.resolve();
    });

    expect(consoleError).not.toHaveBeenCalledWith(
      "Failed to verify email",
      expect.any(Error),
    );
    expect(result.current.authError).toBeNull();

    await act(async () => {
      second.resolve(true);
      await Promise.resolve();
    });

    expect(result.current.form.state.values.flow).toBe("signIn");
    consoleError.mockRestore();
  });

  it("exposes checking state from adapter hook", () => {
    isChecking = true;
    const { result } = renderHook(() => useLoginFlow());

    expect(result.current.isChecking).toBe(true);
  });
});
