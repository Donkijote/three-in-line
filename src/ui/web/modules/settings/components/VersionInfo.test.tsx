import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { VersionInfo } from "./VersionInfo";

describe("VersionInfo", () => {
  it("renders app version and build number", () => {
    vi.stubGlobal("__APP_VERSION__", "2.4.0");
    vi.stubGlobal("__BUILD_NUMBER__", "8892");

    try {
      render(<VersionInfo />);

      expect(
        screen.getByText("Version 2.4.0 (Build 8892)"),
      ).toBeInTheDocument();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
