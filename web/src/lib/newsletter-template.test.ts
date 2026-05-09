import { describe, expect, it } from "vitest";
import { renderNewsletterHtml } from "./newsletter-template";

describe("renderNewsletterHtml", () => {
  const baseInput = {
    editionDate: new Date("2026-05-01T00:00:00Z"),
    subjectLine: "Pastoral Diary · May 2026",
    posts: [],
  };

  it("escapes HTML special characters in the subject line", () => {
    const html = renderNewsletterHtml({
      ...baseInput,
      subjectLine: '<script>alert("x")</script>',
    });
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes HTML in post messages", () => {
    const html = renderNewsletterHtml({
      ...baseInput,
      posts: [
        {
          message: '<img src=x onerror="alert(1)">',
          createdTime: new Date("2026-05-02T10:00:00Z"),
        },
      ],
    });
    expect(html).not.toContain('onerror="alert(1)"');
    expect(html).toContain("&lt;img");
  });

  it("escapes HTML in image URLs (would-be src injection)", () => {
    const html = renderNewsletterHtml({
      ...baseInput,
      posts: [
        {
          message: "Hello",
          imageUrl: 'http://x.test/"><script>alert(1)</script>',
          createdTime: new Date("2026-05-02T10:00:00Z"),
        },
      ],
    });
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("escapes HTML in permalink URLs (would-be href injection)", () => {
    const html = renderNewsletterHtml({
      ...baseInput,
      posts: [
        {
          message: "Hello",
          permalinkUrl:
            'http://x.test/"><script>alert(1)</script>',
          createdTime: new Date("2026-05-02T10:00:00Z"),
        },
      ],
    });
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("includes the broadcast merge tag in the unsubscribe footer when supplied", () => {
    const html = renderNewsletterHtml({
      ...baseInput,
      unsubscribeUrl: "{{{RESEND_UNSUBSCRIBE_URL}}}",
    });
    expect(html).toContain("{{{RESEND_UNSUBSCRIBE_URL}}}");
  });

  it("falls back to the manual unsubscribe URL when none is supplied", () => {
    const html = renderNewsletterHtml(baseInput);
    expect(html).toContain("/connect/newsletter/unsubscribe");
  });

  it("renders newline-separated paragraphs as <p> blocks", () => {
    const html = renderNewsletterHtml({
      ...baseInput,
      posts: [
        {
          message: "First paragraph.\n\nSecond paragraph.",
          createdTime: new Date("2026-05-02T10:00:00Z"),
        },
      ],
    });
    expect(html).toContain("<p style=\"margin:0 0 1em 0;\">First paragraph.</p>");
    expect(html).toContain("<p style=\"margin:0 0 1em 0;\">Second paragraph.</p>");
  });
});
