import { resolvePlayerLabel } from "./user";

describe("resolvePlayerLabel", () => {
  const fallback = "Player";

  it("prefers username over other fields", () => {
    const label = resolvePlayerLabel(
      {
        username: "nova",
        name: "Nova Prime",
        email: "nova@example.com",
      },
      fallback,
    );

    expect(label).toBe("nova");
  });

  it("falls back to name when username is missing", () => {
    const label = resolvePlayerLabel(
      {
        name: "Nova Prime",
        email: "nova@example.com",
      },
      fallback,
    );

    expect(label).toBe("Nova Prime");
  });

  it("uses the email handle when name and username are missing", () => {
    const label = resolvePlayerLabel(
      {
        email: "nova@example.com",
      },
      fallback,
    );

    expect(label).toBe("nova");
  });

  it("returns fallback when no data is available", () => {
    const label = resolvePlayerLabel({}, fallback);

    expect(label).toBe("Player");
  });

  it("keeps name when present even if initials fallback is enabled", () => {
    const label = resolvePlayerLabel(
      {
        name: "Nova Prime",
      },
      fallback,
      { useInitialsFallback: true },
    );

    expect(label).toBe("Nova Prime");
  });

  it("returns the initials fallback placeholder when no identifiers exist", () => {
    const label = resolvePlayerLabel(
      {
        name: "",
        username: "",
        email: "",
      },
      fallback,
      { useInitialsFallback: true },
    );

    expect(label).toBe("?");
  });
});
