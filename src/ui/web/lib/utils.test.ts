import { cn, getFallbackInitials, getInitials, isValidEmail } from "./utils";

describe("cn", () => {
  it("joins class names and skips falsy values", () => {
    expect(cn("p-2", false, null, "text-sm")).toBe("p-2 text-sm");
  });

  it("merges tailwind utility conflicts", () => {
    expect(cn("px-2", "px-4", "text-sm", "text-base")).toBe("px-4 text-base");
  });

  it("accepts arrays and objects", () => {
    expect(
      cn(["rounded", "border"], {
        "text-foreground": true,
        "text-muted-foreground": false,
      }),
    ).toBe("rounded border text-foreground");
  });
});

describe("isValidEmail", () => {
  it("accepts valid email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("first.last+tag@sub.domain.com")).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@example")).toBe(false);
  });
});

describe("getInitials", () => {
  it("returns empty string for empty values", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });

  it("builds initials from multiple words", () => {
    expect(getInitials("Jane Doe")).toBe("JD");
    expect(getInitials("Jane Marie Doe")).toBe("JM");
  });

  it("uses the first two letters for single words", () => {
    expect(getInitials("Nova")).toBe("NO");
    expect(getInitials("A")).toBe("A");
  });
});

describe("getFallbackInitials", () => {
  it("prefers name over username and email", () => {
    expect(
      getFallbackInitials({
        name: "Ada Lovelace",
        username: "ada",
        email: "ada@example.com",
      }),
    ).toBe("AL");
  });

  it("falls back to username when name is missing", () => {
    expect(
      getFallbackInitials({
        username: "neo",
        email: "neo@matrix.io",
      }),
    ).toBe("NE");
  });

  it("falls back to email handle when name and username are missing", () => {
    expect(
      getFallbackInitials({
        email: "trinity@matrix.io",
      }),
    ).toBe("TR");
  });

  it("returns a placeholder when no inputs are provided", () => {
    expect(getFallbackInitials({})).toBe("?");
  });
});
