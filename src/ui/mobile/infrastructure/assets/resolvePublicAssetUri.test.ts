const mockConstants = {
  expoConfig: undefined as undefined | { hostUri?: string | null },
  manifest2: undefined as
    | undefined
    | { extra?: { expoGo?: { debuggerHost?: string | null } } },
};

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: mockConstants,
}));

describe("resolvePublicAssetUri", () => {
  const loadModule = () => {
    let resolvePublicAssetUri:
      | typeof import("./resolvePublicAssetUri").resolvePublicAssetUri
      | undefined;

    jest.isolateModules(() => {
      ({ resolvePublicAssetUri } = require("./resolvePublicAssetUri"));
    });

    if (!resolvePublicAssetUri) {
      throw new Error("Failed to load resolvePublicAssetUri");
    }

    return { resolvePublicAssetUri };
  };

  beforeEach(() => {
    jest.resetModules();
    mockConstants.expoConfig = undefined;
    mockConstants.manifest2 = undefined;
    process.env.EXPO_PUBLIC_PUBLIC_ASSETS_URL = "https://assets.example.com/";
  });

  it("returns absolute asset URLs when configured", () => {
    const { resolvePublicAssetUri } = loadModule();

    expect(resolvePublicAssetUri("/avatars/avatar-1.svg")).toBe(
      "https://assets.example.com/avatars/avatar-1.svg",
    );
  });

  it("infers the dev web asset host from expo config when env is missing", () => {
    process.env.EXPO_PUBLIC_PUBLIC_ASSETS_URL = "";
    mockConstants.expoConfig = { hostUri: "192.168.1.10:8081" };

    const { resolvePublicAssetUri } = loadModule();

    expect(resolvePublicAssetUri("/avatars/avatar-1.svg")).toBe(
      "http://192.168.1.10:5173/avatars/avatar-1.svg",
    );
  });

  it("falls back to manifest2 debugger host inference", () => {
    process.env.EXPO_PUBLIC_PUBLIC_ASSETS_URL = "";
    mockConstants.manifest2 = {
      extra: { expoGo: { debuggerHost: "10.0.0.4:8081" } },
    };

    const { resolvePublicAssetUri } = loadModule();

    expect(resolvePublicAssetUri("/avatars/avatar-2.svg")).toBe(
      "http://10.0.0.4:5173/avatars/avatar-2.svg",
    );
  });

  it("leaves non-root-relative URIs unchanged", () => {
    const { resolvePublicAssetUri } = loadModule();

    expect(resolvePublicAssetUri("https://cdn.example.com/avatar.svg")).toBe(
      "https://cdn.example.com/avatar.svg",
    );
    expect(resolvePublicAssetUri("avatar.svg")).toBe("avatar.svg");
    expect(resolvePublicAssetUri(undefined)).toBeUndefined();
  });

  it("returns the original URI when no asset base can be resolved", () => {
    process.env.EXPO_PUBLIC_PUBLIC_ASSETS_URL = "";

    const { resolvePublicAssetUri } = loadModule();

    expect(resolvePublicAssetUri("/avatars/avatar-3.svg")).toBe(
      "/avatars/avatar-3.svg",
    );
  });
});
