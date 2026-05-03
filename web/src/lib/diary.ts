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
 * The "Upcoming Engagements" homepage section reads directly from the
 * Pastoral Programme global — the office maintains one source of truth
 * for every Mass, visit, ordination, and meeting; this surface shows
 * the next entries scheduled.
 */
export async function getUpcomingEngagements(
  limit = 3,
): Promise<DiaryEntry[]> {
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
    const upcoming = entries
      .map((entry) => {
        const date =
          typeof entry.date === "string" ? entry.date.slice(0, 10) : null;
        const title = typeof entry.title === "string" ? entry.title.trim() : "";
        if (!date || !title) return null;
        return { entry, date, title };
      })
      .filter(
        (item): item is { entry: ProgrammeEntryDoc; date: string; title: string } =>
          item !== null && item.date >= today,
      )
      .sort((a, b) => a.date.localeCompare(b.date)) // soonest first
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

    if (upcoming.length === 0) return FALLBACK_DIARY.slice(0, limit);
    return upcoming;
  } catch (error) {
    console.error("[diary] programme read failed, using fallback:", error);
    return FALLBACK_DIARY.slice(0, limit);
  }
}

// Back-compat alias in case anything still imports the old name.
export const getRecentDiary = getUpcomingEngagements;

export type { DiaryEntry } from "@/data/diary";
