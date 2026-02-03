import { loadUserPreferences } from "./loadUserPreferences";

describe("loadUserPreferences", () => {
  it("returns repository preferences", () => {
    const repository = {
      load: vi.fn(() => ({
        theme: "dark",
        gameSounds: false,
        haptics: true,
      })),
      save: vi.fn(),
    };

    // @ts-expect-error: only for testing mock
    const result = loadUserPreferences(repository);

    expect(result).toEqual({
      theme: "dark",
      gameSounds: false,
      haptics: true,
    });
    expect(repository.load).toHaveBeenCalledTimes(1);
  });
});
