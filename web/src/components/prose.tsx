import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "blockquote", "ul", "ol", "li",
    "strong", "em", "b", "i", "u", "s", "sub", "sup",
    "a", "br", "hr", "span", "abbr", "cite",
    "figure", "figcaption", "img",
    "table", "thead", "tbody", "tr", "td", "th",
    "code", "pre",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height"],
    abbr: ["title"],
    span: ["lang", "class"],
    "*": ["id"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

function renderMarkdown(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}

export type ProseVariant = "default" | "letter";

export function Prose({
  markdown,
  variant = "default",
}: {
  markdown: string;
  variant?: ProseVariant;
}) {
  const html = renderMarkdown(markdown);
  const processed =
    variant === "letter" ? applyHangingNumbers(html) : html;
  const variantClass =
    variant === "letter" ? "prose-editorial-letter" : "prose-editorial";
  return (
    <div
      className={`${variantClass} space-y-5 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink`}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}

/**
 * Transform "<p>1. Text...</p>" paragraphs into
 * "<p class="numbered" data-num="1">Text...</p>" so CSS can render the
 * number in a gutter with a hanging indent. Marked emits numbered lists as
 * <ol> by default, but pastoral letters number every paragraph as prose,
 * not as a list, so we post-process the emitted <p> tags.
 */
function applyHangingNumbers(html: string): string {
  return html.replace(
    /<p>(\d{1,3})\.\s+/g,
    (_m, n) => `<p class="numbered" data-num="${n}">`,
  );
}

/** Strip markdown formatting down to plain text, for use in meta tags, leads, excerpts, etc. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*-{3,}\s*$/gm, "")
    .replace(/(\*\*|__)([\s\S]*?)\1/g, "$2")
    .replace(/(\*|_)([\s\S]*?)\1/g, "$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\\([\\`*_{}\[\]()#+\-.!])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Take the first N characters of plain-text markdown, ellipsizing if truncated. */
export function plainExcerpt(text: string, len = 200): string {
  const plain = stripMarkdown(text);
  return plain.length > len ? plain.slice(0, len).trimEnd() + "…" : plain;
}

/**
 * Parse rendered HTML and return an array of {id, text, level} for the
 * table-of-contents. Also inject id attributes on the headings in the HTML.
 * Runs on the server so the TOC can be built without any client JS.
 */
export function parseHeadings(
  html: string,
): { html: string; headings: { id: string; text: string; level: number }[] } {
  const headings: { id: string; text: string; level: number }[] = [];
  const used = new Set<string>();
  const withIds = html.replace(
    /<(h[23])>([^<]+)<\/\1>/g,
    (_m, tag: string, rawText: string) => {
      const text = rawText.trim();
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
      let suffix = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      headings.push({ id, text, level: tag === "h2" ? 2 : 3 });
      return `<${tag} id="${id}">${text}</${tag}>`;
    },
  );
  return { html: withIds, headings };
}

/**
 * Server-rendered Prose that also returns the extracted headings for a TOC.
 * Use this when you want to render the body and a TOC side-by-side.
 */
export function renderProse(
  markdown: string,
  variant: ProseVariant = "default",
): { html: string; headings: { id: string; text: string; level: number }[] } {
  const raw = renderMarkdown(markdown);
  const processed = variant === "letter" ? applyHangingNumbers(raw) : raw;
  return parseHeadings(processed);
}
