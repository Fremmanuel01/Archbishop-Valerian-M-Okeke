// Canonical domain for the site. Always prefer the apex hostname so that
// social cards, JSON-LD, sitemap entries, email links, and the
// `<link rel="canonical">` declarations all line up. The .vercel.app
// alias still works (kept as-is) but search engines and shared links
// should resolve here. Override via NEXT_PUBLIC_SITE_URL only when
// previewing branches.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://archbishopvalokeke.org";
