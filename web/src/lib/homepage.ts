import "server-only";
import { getPayloadClient } from "./payload";

export type HomepageContent = {
  heroEyebrow: string;
  heroSubheading: string;
  heroImageUrl: string | null;
  heroImageAlt: string;
  dailyReflectionQuote: string;
  featuredQuote: string;
  featuredQuoteAttribution: string;
};

const FALLBACK: HomepageContent = {
  heroEyebrow: "His Grace · Most Reverend",
  heroSubheading:
    "Metropolitan Archbishop of Onitsha · Servant of the Lord's vineyard since the year of Our Lord MMIII.",
  heroImageUrl: null,
  heroImageAlt: "His Grace Archbishop Valerian M. Okeke with episcopal crozier",
  dailyReflectionQuote:
    "Our finest gifts can become our worst sins or defects, if we do not act with love and allow ourselves to be guided by the Holy Spirit.",
  featuredQuote:
    "The Eucharist is not a doctrine we defend but a fire we receive, and into which we are continually drawn.",
  featuredQuoteAttribution: "— Most Rev. Valerian M. Okeke",
};

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function extractLexicalText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const root = (value as { root?: LexicalNode }).root;
  if (!root) return "";
  const buf: string[] = [];
  const walk = (node: LexicalNode) => {
    if (typeof node.text === "string") buf.push(node.text);
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
      buf.push(" ");
    }
  };
  walk(root);
  return buf.join("").replace(/\s+/g, " ").trim();
}

function imageUrl(image: unknown): string | null {
  if (image && typeof image === "object" && "url" in image) {
    const url = (image as { url?: string | null }).url;
    return typeof url === "string" && url.length > 0 ? url : null;
  }
  return null;
}

function imageAlt(image: unknown, fallback: string): string {
  if (image && typeof image === "object" && "alt" in image) {
    const alt = (image as { alt?: string | null }).alt;
    if (typeof alt === "string" && alt.length > 0) return alt;
  }
  return fallback;
}

export async function getHomepage(): Promise<HomepageContent> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "homepage",
      depth: 1,
    });

    const reflection = extractLexicalText(doc.dailyReflection);

    return {
      heroEyebrow:
        (typeof doc.heroEyebrow === "string" && doc.heroEyebrow.trim()) ||
        FALLBACK.heroEyebrow,
      heroSubheading:
        (typeof doc.heroSubheading === "string" && doc.heroSubheading.trim()) ||
        FALLBACK.heroSubheading,
      heroImageUrl: imageUrl(doc.heroImage),
      heroImageAlt: imageAlt(doc.heroImage, FALLBACK.heroImageAlt),
      dailyReflectionQuote: reflection || FALLBACK.dailyReflectionQuote,
      featuredQuote:
        (typeof doc.featuredQuote === "string" && doc.featuredQuote.trim()) ||
        FALLBACK.featuredQuote,
      featuredQuoteAttribution:
        (typeof doc.featuredQuoteAttribution === "string" &&
          doc.featuredQuoteAttribution.trim()) ||
        FALLBACK.featuredQuoteAttribution,
    };
  } catch (error) {
    console.error("[homepage] payload read failed, using fallback:", error);
    return FALLBACK;
  }
}
