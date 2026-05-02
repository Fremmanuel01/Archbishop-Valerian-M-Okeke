// Editorial fallback used when no published DiaryEntries exist in Payload
// (or when the CMS is unreachable). Once an editor publishes their first
// entry these are superseded automatically.

export type DiaryEntry = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  location?: string;
  coverImageUrl?: string;
};

export const FALLBACK_DIARY: DiaryEntry[] = [
  {
    id: "fallback-2026-04-06",
    title: "Easter Day Sermon at the Basilica of the Most Holy Trinity",
    date: "2026-04-06",
    excerpt:
      "The Risen Christ is not a memory we visit but a Presence we receive.",
  },
  {
    id: "fallback-2026-03-28",
    title: "Pastoral Visit to St Joseph's Seminary, Awka-Etiti",
    date: "2026-03-28",
    excerpt:
      "An afternoon of formation, prayer, and counsel with the seminarians.",
  },
  {
    id: "fallback-2026-03-14",
    title:
      "Confirmation Mass at Our Lady's Secondary School, Nnobi",
    date: "2026-03-14",
    excerpt:
      "Sealed with the gift of the Spirit, eighty-four young women received Confirmation.",
  },
];
