import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("rate-limit", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the threshold", async () => {
    const { checkRateLimit } = await import("./rate-limit");
    const input = {
      action: "test",
      identifier: "1.2.3.4",
      max: 3,
      windowSec: 60,
    };
    expect(await checkRateLimit(input)).toEqual({ ok: true });
    expect(await checkRateLimit(input)).toEqual({ ok: true });
    expect(await checkRateLimit(input)).toEqual({ ok: true });
  });

  it("rejects the request that crosses the threshold", async () => {
    const { checkRateLimit } = await import("./rate-limit");
    const input = {
      action: "test",
      identifier: "1.2.3.4",
      max: 3,
      windowSec: 60,
    };
    await checkRateLimit(input);
    await checkRateLimit(input);
    await checkRateLimit(input);
    const result = await checkRateLimit(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.retryAfterSec).toBeGreaterThan(0);
      expect(result.retryAfterSec).toBeLessThanOrEqual(60);
    }
  });

  it("releases capacity once the window expires", async () => {
    const { checkRateLimit } = await import("./rate-limit");
    const input = {
      action: "test",
      identifier: "1.2.3.4",
      max: 2,
      windowSec: 60,
    };
    await checkRateLimit(input);
    await checkRateLimit(input);
    expect((await checkRateLimit(input)).ok).toBe(false);
    vi.advanceTimersByTime(61_000);
    expect(await checkRateLimit(input)).toEqual({ ok: true });
  });

  it("buckets per identifier so different IPs do not interfere", async () => {
    const { checkRateLimit } = await import("./rate-limit");
    const a = {
      action: "test",
      identifier: "1.1.1.1",
      max: 1,
      windowSec: 60,
    };
    const b = { ...a, identifier: "2.2.2.2" };
    expect(await checkRateLimit(a)).toEqual({ ok: true });
    expect((await checkRateLimit(a)).ok).toBe(false);
    expect(await checkRateLimit(b)).toEqual({ ok: true });
  });

  it("normalises identifiers to lowercase so casing does not split buckets", async () => {
    const { checkRateLimit } = await import("./rate-limit");
    const lower = {
      action: "test",
      identifier: "user@example.com",
      max: 1,
      windowSec: 60,
    };
    const upper = { ...lower, identifier: "USER@example.com" };
    expect(await checkRateLimit(lower)).toEqual({ ok: true });
    expect((await checkRateLimit(upper)).ok).toBe(false);
  });

  it("treats max <= 0 or window <= 0 as 'no limit'", async () => {
    const { checkRateLimit } = await import("./rate-limit");
    expect(
      await checkRateLimit({
        action: "x",
        identifier: "y",
        max: 0,
        windowSec: 60,
      }),
    ).toEqual({ ok: true });
    expect(
      await checkRateLimit({
        action: "x",
        identifier: "y",
        max: 1,
        windowSec: 0,
      }),
    ).toEqual({ ok: true });
  });
});
