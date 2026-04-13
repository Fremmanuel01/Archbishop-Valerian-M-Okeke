import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function Prose({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown, { async: false }) as string;
  return (
    <div
      className="prose-editorial space-y-5 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink"
      dangerouslySetInnerHTML={{ __html: html }}
    />
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
