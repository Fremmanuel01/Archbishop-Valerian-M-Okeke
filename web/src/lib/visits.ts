import "server-only";
import { getPayloadClient } from "./payload";

export type PastoralVisit = {
  id: string;
  title: string;
  date: string;
  year: number;
  month: string;
  parish?: string;
  deanery?: string;
  summary?: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const FALLBACK_VISITS: PastoralVisit[] = [];

export async function getPastoralVisits(): Promise<PastoralVisit[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pastoral-visits",
      sort: "-date",
      limit: 200,
      depth: 0,
    });
    if (!result.docs.length) return FALLBACK_VISITS;
    return result.docs
      .map((doc): PastoralVisit | null => {
        const date = typeof doc.date === "string" ? doc.date : null;
        const title = typeof doc.title === "string" ? doc.title : null;
        if (!date || !title) return null;
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) return null;
        return {
          id: String(doc.id),
          title,
          date,
          year: d.getUTCFullYear(),
          month: MONTH_NAMES[d.getUTCMonth()],
          parish:
            typeof doc.parish === "string" && doc.parish.length > 0
              ? doc.parish
              : undefined,
          deanery:
            typeof doc.deanery === "string" && doc.deanery.length > 0
              ? doc.deanery
              : undefined,
          summary:
            typeof doc.summary === "string" && doc.summary.length > 0
              ? doc.summary
              : undefined,
        };
      })
      .filter((v): v is PastoralVisit => v !== null);
  } catch (error) {
    console.error("[visits] payload read failed, using fallback:", error);
    return FALLBACK_VISITS;
  }
}
