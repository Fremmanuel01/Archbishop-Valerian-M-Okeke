import "server-only";
import { getPayloadClient } from "./payload";
import { FALLBACK_DIARY, type DiaryEntry } from "@/data/diary";

const TIMEZONE = "Africa/Lagos";

function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).format(new Date());
}

function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

type ProgrammeEntryDoc = {
  id?: string;
  date?: string | null;
  title?: string | null;
  location?: string | null;
  notes?: string | null;
};

/**
 * The "Recent Engagements" homepage section reads directly from the
 * Pastoral Programme global — the office maintains one source of truth
 * for every Mass, visit, ordination, and meeting; this surface just
 * shows the most recent entries that have already taken place.
 */
export async function getRecentDiary(limit = 3): Promise<DiaryEntry[]> {
  try {
    const payload = await getPayloadClient();
    const programme = await payload.findGlobal({
      slug: "programme",
      depth: 0,
    });
    const entries = Array.isArray(programme.upcoming)
      ? (programme.upcoming as ProgrammeEntryDoc[])
      : [];
    const today = todayIso();
    const past = entries
      .map((entry) => {
        const date =
          typeof entry.date === "string" ? entry.date.slice(0, 10) : null;
        const title = typeof entry.title === "string" ? entry.title.trim() : "";
        if (!date || !title) return null;
        return { entry, date, title };
      })
      .filter(
        (item): item is { entry: ProgrammeEntryDoc; date: string; title: string } =>
          item !== null && item.date <= today,
      )
      .sort((a, b) => b.date.localeCompare(a.date)) // newest first
      .slice(0, limit)
      .map(({ entry, date, title }, idx): DiaryEntry => ({
        id: `programme-${date}-${slugifySegment(title) || idx.toString()}`,
        title,
        date,
        excerpt:
          typeof entry.notes === "string" && entry.notes.length > 0
            ? entry.notes
            : "",
        location:
          typeof entry.location === "string" && entry.location.length > 0
            ? entry.location
            : undefined,
        coverImageUrl: undefined,
      }));

    if (past.length === 0) return FALLBACK_DIARY.slice(0, limit);
    return past;
  } catch (error) {
    console.error("[diary] programme read failed, using fallback:", error);
    return FALLBACK_DIARY.slice(0, limit);
  }
}

export type { DiaryEntry } from "@/data/diary";
