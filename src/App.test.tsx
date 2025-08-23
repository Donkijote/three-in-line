import { afterAll, beforeAll } from "vitest";

import { StorageKeys, StorageService } from "@/application/storage-service";

import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App Test", () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
  });
  afterAll(() => {
    StorageService.remove(StorageKeys.USER_SETTINGS);
  });

  test("Render App", () => {
    render(<App />);
    expect(screen.getByTestId("app")).toBeInTheDocument();
  });

  test("Render Board after modal", () => {
    StorageService.set(StorageKeys.USER_SETTINGS, { name: "Test" });
    render(<App />);

    expect(screen.getByTestId("app")).toBeInTheDocument();
    expect(screen.getByTestId("Board")).toBeInTheDocument();
  });
});
