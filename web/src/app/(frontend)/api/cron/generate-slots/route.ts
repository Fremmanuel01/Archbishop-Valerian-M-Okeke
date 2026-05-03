import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

// Default office hours. Easy to extend later — e.g. add an afternoon block,
// or tighten/widen by audience. Six 30-minute windows per day, per audience.
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

const HORIZON_DAYS = 90; // ~3 months ahead

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // No secret configured — fail closed in production, allow in dev so
    // operators can test locally with curl.
    return process.env.NODE_ENV !== "production";
  }
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await getPayloadClient();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setUTCDate(today.getUTCDate() + HORIZON_DAYS);

  // One query for every slot in the horizon — we'll create only what's missing.
  const existing = await payload.find({
    collection: "appointment-slots",
    where: {
      and: [
        { date: { greater_than_equal: isoDate(today) } },
        { date: { less_than_equal: isoDate(horizon) } },
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

  const created: Array<{ date: string; startTime: string; audience: string }> = [];

  for (let dayOffset = 0; dayOffset <= HORIZON_DAYS; dayOffset++) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + dayOffset);
    const weekday = date.getUTCDay();
    const dateIso = isoDate(date);

    for (const [audience, schedule] of Object.entries(SCHEDULE)) {
      if (weekday !== schedule.weekday) continue;
      for (const [startTime, endTime] of schedule.times) {
        const key = `${dateIso}|${startTime}|${audience}`;
        if (existingKeys.has(key)) continue;
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
          created.push({ date: dateIso, startTime, audience });
        } catch (err) {
          console.error("[cron/generate-slots] create failed:", err);
        }
      }
    }
  }

  return Response.json({
    ok: true,
    horizonDays: HORIZON_DAYS,
    existing: existing.docs.length,
    created: created.length,
    sample: created.slice(0, 5),
  });
}
