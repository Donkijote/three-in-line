import type { ReactNode } from "react";

describe("VersionInfo", () => {
  it("renders the ios build number when available", () => {
    jest.isolateModules(() => {
      jest.doMock("expo-constants", () => ({
        __esModule: true,
        default: {
          expoConfig: {
            version: "1.2.3",
            ios: { buildNumber: "44" },
          },
        },
      }));

      const { VersionInfo } = require("./VersionInfo") as typeof import("./VersionInfo");
      const element = VersionInfo() as {
        props: { children: ReactNode };
      };

      expect((element.props.children as string[]).join("")).toBe(
        "Version 1.2.3 (Build 44)",
      );
    });
  });

  it("falls back to the android version code or dev build", () => {
    jest.isolateModules(() => {
      jest.doMock("expo-constants", () => ({
        __esModule: true,
        default: {
          expoConfig: {
            version: "2.0.0",
            android: { versionCode: 9 },
          },
        },
      }));

      const { VersionInfo } = require("./VersionInfo") as typeof import("./VersionInfo");
      const element = VersionInfo() as {
        props: { children: ReactNode };
      };

      expect((element.props.children as string[]).join("")).toBe(
        "Version 2.0.0 (Build 9)",
      );
    });
  });

  it("falls back to the default version metadata when expo config is missing", () => {
    jest.isolateModules(() => {
      jest.doMock("expo-constants", () => ({
        __esModule: true,
        default: {},
      }));

      const { VersionInfo } = require("./VersionInfo") as typeof import("./VersionInfo");
      const element = VersionInfo() as {
        props: { children: ReactNode };
      };

      expect((element.props.children as string[]).join("")).toBe(
        "Version 0.0.0 (Build dev)",
      );
    });
  });
});
