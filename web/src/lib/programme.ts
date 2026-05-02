import "server-only";
import {
  PROGRAMME_ENTRIES,
  PROGRAMME_YEAR,
  type ProgrammeEntry,
  type ProgrammeCategory,
} from "@/data/pastoral-programme";
import { getPayloadClient } from "./payload";

export type {
  ProgrammeEntry,
  ProgrammeCategory,
} from "@/data/pastoral-programme";

function deriveCategory(title: string): ProgrammeCategory {
  const t = title.toLowerCase();
  if (t.includes("ordination")) return "Ordination";
  if (t.includes("retreat")) return "Retreat";
  if (t.includes("pastoral visit") || t.includes("visitation")) {
    return "Pastoral Visit";
  }
  if (t.includes("meeting") || t.includes("council")) return "Meeting";
  if (t.includes("mass") || t.includes("liturgy") || t.includes("vigil")) {
    return "Mass";
  }
  return "Special";
}

function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

type ProgrammeUpcomingDoc = {
  id?: string;
  date?: string | null;
  title?: string | null;
  location?: string | null;
  notes?: string | null;
};

export async function getProgrammeEntries(): Promise<ProgrammeEntry[]> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "programme",
      depth: 0,
    });
    const upcoming = Array.isArray(doc.upcoming)
      ? (doc.upcoming as ProgrammeUpcomingDoc[])
      : [];
    if (upcoming.length === 0) return PROGRAMME_ENTRIES;
    return upcoming
      .map((item, idx): ProgrammeEntry | null => {
        const start = item.date?.slice(0, 10);
        const title = item.title?.trim();
        if (!start || !title) return null;
        return {
          id: `cms-${start}-${slugifySegment(title) || idx.toString()}`,
          start,
          title,
          location: item.location ?? undefined,
          description: item.notes ?? undefined,
          category: deriveCategory(title),
        };
      })
      .filter((e): e is ProgrammeEntry => e !== null)
      .sort((a, b) => a.start.localeCompare(b.start));
  } catch (error) {
    console.error("[programme] payload read failed, using fallback:", error);
    return PROGRAMME_ENTRIES;
  }
}

export async function getProgrammeYear(): Promise<number> {
  const entries = await getProgrammeEntries();
  if (entries.length === 0) return PROGRAMME_YEAR;
  const firstYear = Number(entries[0].start.slice(0, 4));
  return Number.isFinite(firstYear) ? firstYear : PROGRAMME_YEAR;
}
