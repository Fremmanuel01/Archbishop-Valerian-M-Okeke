"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import type { GenerateState } from "./types";

// Default office hours. Six 30-minute windows per audience per office day.
// Edit here to change the schedule the generator uses.
const SCHEDULE = {
  laity: {
    weekday: 2, // Tuesday (Sunday = 0)
    times: [
      ["09:00", "09:30"],
      ["09:30", "10:00"],
      ["10:00", "10:30"],
      ["10:30", "11:00"],
      ["11:00", "11:30"],
      ["11:30", "12:00"],
    ],
  },
  clergy: {
    weekday: 3, // Wednesday
    times: [
      ["09:00", "09:30"],
      ["09:30", "10:00"],
      ["10:00", "10:30"],
      ["10:30", "11:00"],
      ["11:00", "11:30"],
      ["11:30", "12:00"],
    ],
  },
} as const;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function generateSlotsForYear(
  _prev: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  // Auth: must be a logged-in Payload user.
  const headersList = await headers();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) {
    return {
      ok: false,
      message: "You must be signed in to /admin to use this tool.",
      created: 0,
      skipped: 0,
      yearGenerated: null,
    };
  }

  const yearRaw = formData.get("year")?.toString().trim() ?? "";
  const year = Number.parseInt(yearRaw, 10);
  if (!Number.isFinite(year) || year < 2024 || year > 2100) {
    return {
      ok: false,
      message: `Pick a year between 2024 and 2100. (Got "${yearRaw}".)`,
      created: 0,
      skipped: 0,
      yearGenerated: null,
    };
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayIso = isoDate(today);

  // Window starts at the later of (today) or (Jan 1 of selected year),
  // ends at Dec 31 of selected year. Avoids creating slots in the past.
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31));
  const startDate = yearStart < today ? today : yearStart;
  if (yearEnd < today) {
    return {
      ok: false,
      message: `${year} is fully in the past. Nothing to generate.`,
      created: 0,
      skipped: 0,
      yearGenerated: year,
    };
  }

  // One query for everything in the window — only create what's missing.
  const existing = await payload.find({
    collection: "appointment-slots",
    where: {
      and: [
        { date: { greater_than_equal: isoDate(startDate) } },
        { date: { less_than_equal: isoDate(yearEnd) } },
      ],
    },
    limit: 5000,
    depth: 0,
  });

  const existingKeys = new Set(
    existing.docs.map((doc) => {
      const date =
        typeof doc.date === "string" ? doc.date.slice(0, 10) : "";
      return `${date}|${doc.startTime}|${doc.audience}`;
    }),
  );

  let created = 0;
  let skipped = 0;
  const cursor = new Date(startDate);

  while (cursor <= yearEnd) {
    const weekday = cursor.getUTCDay();
    const dateIso = isoDate(cursor);
    if (dateIso < todayIso) {
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      continue;
    }
    for (const [audience, schedule] of Object.entries(SCHEDULE)) {
      if (weekday !== schedule.weekday) continue;
      for (const [startTime, endTime] of schedule.times) {
        const key = `${dateIso}|${startTime}|${audience}`;
        if (existingKeys.has(key)) {
          skipped++;
          continue;
        }
        try {
          await payload.create({
            collection: "appointment-slots",
            data: {
              date: dateIso,
              startTime,
              endTime,
              audience: audience as "laity" | "clergy",
              status: "available",
            },
          });
          created++;
        } catch (err) {
          console.error("[generate-slots] create failed:", err);
        }
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  try {
    revalidatePath("/connect/appointment-laity");
    revalidatePath("/connect/appointment-clergy");
  } catch {
    /* not in a request context — fine */
  }

  return {
    ok: true,
    message:
      created === 0
        ? `Nothing to do. Every Tuesday/Wednesday slot for ${year} already exists.`
        : `Generated ${created} new slot${created === 1 ? "" : "s"} for ${year}. (${skipped} already existed.)`,
    created,
    skipped,
    yearGenerated: year,
  };
}
