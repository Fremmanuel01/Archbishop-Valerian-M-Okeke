import "server-only";
import { getPayloadClient } from "./payload";

export type Audience = "laity" | "clergy";

export type AvailableSlot = {
  id: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  audience: Audience;
};

export type SlotsByDate = {
  date: string;
  weekday: string;
  longDate: string;
  slots: AvailableSlot[];
};

const TIMEZONE = "Africa/Lagos";

function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).format(new Date());
}

function addWeeks(iso: string, weeks: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function formatWeekday(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  }).format(d);
}

export async function getAvailableSlots(
  audience: Audience,
  weeksAhead = 8,
): Promise<SlotsByDate[]> {
  try {
    const payload = await getPayloadClient();
    const today = todayIso();
    const horizon = addWeeks(today, weeksAhead);
    const result = await payload.find({
      collection: "appointment-slots",
      where: {
        and: [
          { audience: { equals: audience } },
          { status: { equals: "available" } },
          { date: { greater_than_equal: today } },
          { date: { less_than_equal: horizon } },
        ],
      },
      sort: ["date", "startTime"],
      limit: 200,
      depth: 0,
    });

    const grouped = new Map<string, AvailableSlot[]>();
    for (const doc of result.docs) {
      const date =
        typeof doc.date === "string" ? doc.date.slice(0, 10) : null;
      const startTime =
        typeof doc.startTime === "string" ? doc.startTime : null;
      const endTime = typeof doc.endTime === "string" ? doc.endTime : null;
      if (!date || !startTime || !endTime) continue;
      const slot: AvailableSlot = {
        id: Number(doc.id),
        date,
        startTime,
        endTime,
        audience,
      };
      const bucket = grouped.get(date) ?? [];
      bucket.push(slot);
      grouped.set(date, bucket);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, slots]) => ({
        date,
        weekday: formatWeekday(date),
        longDate: formatLongDate(date),
        slots: slots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
  } catch (error) {
    console.error("[appointments] failed to load slots:", error);
    return [];
  }
}

export async function getBookingByCode(code: string) {
  if (!code || typeof code !== "string") return null;
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "appointment-bookings",
      where: { confirmationCode: { equals: code } },
      limit: 1,
      depth: 1,
      overrideAccess: true, // public lookup by code is the auth surface
    });
    return result.docs[0] ?? null;
  } catch (error) {
    console.error("[appointments] failed to load booking:", error);
    return null;
  }
}

export function audienceCopy(audience: Audience) {
  return audience === "laity"
    ? {
        eyebrow: "For the Lay Faithful",
        heading: "Schedule a Meeting",
        accent: "with His Grace",
        lead:
          "His Grace meets with the lay faithful on Tuesdays. Choose a free slot below; confirmation arrives by email immediately.",
        weekday: "Tuesday",
        otherHref: "/connect/appointment-clergy",
        otherLabel: "Priests & Religious meet on Wednesdays →",
      }
    : {
        eyebrow: "For Priests & Religious",
        heading: "Schedule a Meeting",
        accent: "with His Grace",
        lead:
          "His Grace meets with priests and religious on Wednesdays. Choose a free slot below; confirmation arrives by email immediately.",
        weekday: "Wednesday",
        otherHref: "/connect/appointment-laity",
        otherLabel: "← Lay faithful meet on Tuesdays",
      };
}
