import { act, renderHook } from "@testing-library/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { UserAvatar } from "@/domain/entities/Avatar";
import {
  toDomainUser,
  userRepository,
} from "@/infrastructure/convex/repository/userRepository";

import {
  useCheckEmailExists,
  useCheckUsernameExists,
  useCurrentUser,
  useUpdateAvatar,
  useUpdateUsername,
  useUserById,
} from "./useUser";

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

const {
  useQueryMock,
  checkEmailExistsUseCaseMock,
  checkUsernameExistsUseCaseMock,
  updateAvatarUseCaseMock,
  updateUsernameUseCaseMock,
} = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
  checkEmailExistsUseCaseMock: vi.fn(),
  checkUsernameExistsUseCaseMock: vi.fn(),
  updateAvatarUseCaseMock: vi.fn(),
  updateUsernameUseCaseMock: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useQuery: useQueryMock,
  ConvexReactClient: class ConvexReactClient {
    query = vi.fn();
    mutation = vi.fn();

    constructor() {
      return;
    }
  },
}));

vi.mock("@/application/users/checkEmailExistsUseCase", () => ({
  checkEmailExistsUseCase: checkEmailExistsUseCaseMock,
}));

vi.mock("@/application/users/checkUsernameExistsUseCase", () => ({
  checkUsernameExistsUseCase: checkUsernameExistsUseCaseMock,
}));

vi.mock("@/application/users/updateAvatarUseCase", () => ({
  updateAvatarUseCase: updateAvatarUseCaseMock,
}));

vi.mock("@/application/users/updateUsernameUseCase", () => ({
  updateUsernameUseCase: updateUsernameUseCaseMock,
}));

const userDoc = {
  _id: "user-1" as Id<"users">,
  name: "Jess",
  email: "jess@example.com",
  username: "jess",
  image: "https://example.com/jess.png",
  avatar: {
    type: "preset",
    value: "avatar-1",
  } as UserAvatar,
  avatars: [
    {
      type: "preset",
      value: "avatar-1",
    } as UserAvatar,
  ],
  _creationTime: Date.now(),
};

describe("useUser hooks", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
    checkEmailExistsUseCaseMock.mockReset();
    checkUsernameExistsUseCaseMock.mockReset();
    updateAvatarUseCaseMock.mockReset();
    updateUsernameUseCaseMock.mockReset();
  });

  it("tracks loading state while checking if an email exists", async () => {
    const deferred = createDeferred<boolean>();
    checkEmailExistsUseCaseMock.mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useCheckEmailExists());

    expect(result.current.isChecking).toBe(false);

    let response: boolean | undefined;
    let promise: Promise<boolean> | undefined;

    act(() => {
      promise = result.current.checkEmailExists("player@example.com");
    });

    expect(checkEmailExistsUseCaseMock).toHaveBeenCalledWith(
      userRepository,
      "player@example.com",
    );
    expect(result.current.isChecking).toBe(true);

    await act(async () => {
      deferred.resolve(true);
      response = await promise;
    });

    expect(response).toBe(true);
    expect(result.current.isChecking).toBe(false);
  });

  it("tracks loading state while checking if a username exists", async () => {
    const deferred = createDeferred<boolean>();
    checkUsernameExistsUseCaseMock.mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useCheckUsernameExists());

    expect(result.current.isChecking).toBe(false);

    let response: boolean | undefined;
    let promise: Promise<boolean> | undefined;

    act(() => {
      promise = result.current.checkUsernameExists("player-one");
    });

    expect(checkUsernameExistsUseCaseMock).toHaveBeenCalledWith(
      userRepository,
      "player-one",
    );
    expect(result.current.isChecking).toBe(true);

    await act(async () => {
      deferred.resolve(false);
      response = await promise;
    });

    expect(response).toBe(false);
    expect(result.current.isChecking).toBe(false);
  });

  it("maps the current user query to a domain user", () => {
    useQueryMock.mockReturnValue(userDoc);

    const { result } = renderHook(() => useCurrentUser());

    expect(useQueryMock).toHaveBeenCalledWith(api.users.getCurrentUser);
    expect(result.current).toEqual(toDomainUser(userDoc));
  });

  it("returns null for the current user when the query has no data", () => {
    useQueryMock.mockReturnValue(null);

    const { result } = renderHook(() => useCurrentUser());

    expect(useQueryMock).toHaveBeenCalledWith(api.users.getCurrentUser);
    expect(result.current).toBe(null);
  });

  it("skips loading a user when no id is provided", () => {
    useQueryMock.mockReturnValue(null);

    const { result } = renderHook(() => useUserById(undefined));

    expect(useQueryMock).toHaveBeenCalledWith(api.users.getUserById, "skip");
    expect(result.current).toBe(null);
  });

  it("maps a queried user to a domain user", () => {
    useQueryMock.mockReturnValue(userDoc);

    const { result } = renderHook(() => useUserById("user-2"));

    expect(useQueryMock).toHaveBeenCalledWith(api.users.getUserById, {
      userId: "user-2",
    });
    expect(result.current).toEqual(toDomainUser(userDoc));
  });

  it("delegates username updates to the use case", async () => {
    updateUsernameUseCaseMock.mockResolvedValue({ id: "user-1" });

    const { result } = renderHook(() => useUpdateUsername());

    let response: { id: string } | undefined;

    await act(async () => {
      response = await result.current({ username: "nova" });
    });

    expect(updateUsernameUseCaseMock).toHaveBeenCalledWith(
      userRepository,
      "nova",
    );
    expect(response).toEqual({ id: "user-1" });
  });

  it("delegates avatar updates to the use case", async () => {
    updateAvatarUseCaseMock.mockResolvedValue({ id: "user-1" });

    const { result } = renderHook(() => useUpdateAvatar());

    const avatar = {
      type: "preset",
      value: "avatar-3",
    } as UserAvatar;
    let response: { id: string } | undefined;

    await act(async () => {
      response = await result.current({ avatar });
    });

    expect(updateAvatarUseCaseMock).toHaveBeenCalledWith(
      userRepository,
      avatar,
    );
    expect(response).toEqual({ id: "user-1" });
  });
});
