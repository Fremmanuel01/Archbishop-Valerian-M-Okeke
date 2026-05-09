import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_SECRET = process.env.PAYLOAD_SECRET;

describe("newsletter-token", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.PAYLOAD_SECRET = "x".repeat(32);
  });
  afterEach(() => {
    if (ORIGINAL_SECRET === undefined) delete process.env.PAYLOAD_SECRET;
    else process.env.PAYLOAD_SECRET = ORIGINAL_SECRET;
    vi.useRealTimers();
  });

  it("round-trips a confirm token", async () => {
    const { createNewsletterToken, verifyNewsletterToken } = await import(
      "./newsletter-token"
    );
    const token = createNewsletterToken("confirm", "Foo@Bar.org", {
      name: "Foo Bar",
    });
    const verified = verifyNewsletterToken(token, "confirm");
    expect(verified).not.toBeNull();
    expect(verified!.email).toBe("foo@bar.org");
    expect(verified!.name).toBe("Foo Bar");
    expect(verified!.purpose).toBe("confirm");
  });

  it("rejects a token whose signature has been tampered with", async () => {
    const { createNewsletterToken, verifyNewsletterToken } = await import(
      "./newsletter-token"
    );
    const token = createNewsletterToken("confirm", "foo@bar.org");
    const parts = token.split(".");
    const tamperedSig = parts[3]
      .split("")
      .reverse()
      .join("");
    const tampered = [parts[0], parts[1], parts[2], tamperedSig].join(".");
    expect(verifyNewsletterToken(tampered, "confirm")).toBeNull();
  });

  it("rejects a token presented under the wrong purpose", async () => {
    const { createNewsletterToken, verifyNewsletterToken } = await import(
      "./newsletter-token"
    );
    const token = createNewsletterToken("confirm", "foo@bar.org");
    expect(verifyNewsletterToken(token, "unsubscribe")).toBeNull();
  });

  it("rejects an expired token", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { createNewsletterToken, verifyNewsletterToken } = await import(
      "./newsletter-token"
    );
    const token = createNewsletterToken("confirm", "foo@bar.org");
    // Move clock 8 days forward (confirm TTL is 7 days).
    vi.setSystemTime(new Date("2026-01-09T00:00:00Z"));
    expect(verifyNewsletterToken(token, "confirm")).toBeNull();
  });

  it("normalises email to lowercase before signing", async () => {
    const { createNewsletterToken, verifyNewsletterToken } = await import(
      "./newsletter-token"
    );
    const token = createNewsletterToken("confirm", "FOO@BAR.ORG");
    const verified = verifyNewsletterToken(token, "confirm");
    expect(verified!.email).toBe("foo@bar.org");
  });

  it("throws if PAYLOAD_SECRET is missing", async () => {
    delete process.env.PAYLOAD_SECRET;
    const { createNewsletterToken } = await import("./newsletter-token");
    expect(() => createNewsletterToken("confirm", "foo@bar.org")).toThrow(
      /PAYLOAD_SECRET/,
    );
  });
});
