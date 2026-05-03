import { getPayloadClient } from "@/lib/payload";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

type ProgrammeEntry = {
  date: string;
  title: string;
  location?: string;
  notes?: string;
};

function escapeIcs(value: string): string {
  // Per RFC 5545: backslash, semicolon, comma, and newlines must be escaped.
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function compactDate(iso: string): string {
  return iso.replace(/-/g, "");
}

function nextDayCompact(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function slugForUid(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "entry"
  );
}

// RFC 5545: lines longer than 75 octets must be folded by inserting CRLF
// followed by a single space. Most calendar clients tolerate longer lines,
// but folding correctly avoids strict-parser failures.
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    const end = Math.min(i + 75, line.length);
    chunks.push(line.slice(i, end));
    i = end;
  }
  return chunks.join("\r\n ");
}

export async function GET() {
  let entries: ProgrammeEntry[] = [];
  try {
    const payload = await getPayloadClient();
    const programme = await payload.findGlobal({
      slug: "programme",
      depth: 0,
    });
    const upcoming = Array.isArray(programme.upcoming)
      ? (programme.upcoming as Array<Record<string, unknown>>)
      : [];
    entries = upcoming
      .map((entry): ProgrammeEntry | null => {
        const date =
          typeof entry.date === "string" ? entry.date.slice(0, 10) : "";
        const title =
          typeof entry.title === "string" ? entry.title.trim() : "";
        if (!date || !title) return null;
        return {
          date,
          title,
          location:
            typeof entry.location === "string" && entry.location.trim().length > 0
              ? entry.location.trim()
              : undefined,
          notes:
            typeof entry.notes === "string" && entry.notes.trim().length > 0
              ? entry.notes.trim()
              : undefined,
        };
      })
      .filter((entry): entry is ProgrammeEntry => entry !== null)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error("[programme.ics] read failed:", err);
  }

  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const domain = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Office of His Grace//Pastoral Programme//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Pastoral Programme · Archbishop of Onitsha",
    "X-WR-CALDESC:Pastoral programme of His Grace Most Rev. Valerian M. Okeke, Metropolitan Archbishop of Onitsha.",
    "X-WR-TIMEZONE:Africa/Lagos",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];

  for (const entry of entries) {
    const uid = `programme-${entry.date}-${slugForUid(entry.title)}@${domain}`;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART;VALUE=DATE:${compactDate(entry.date)}`);
    lines.push(`DTEND;VALUE=DATE:${nextDayCompact(entry.date)}`);
    lines.push(fold(`SUMMARY:${escapeIcs(entry.title)}`));
    if (entry.location) {
      lines.push(fold(`LOCATION:${escapeIcs(entry.location)}`));
    }
    if (entry.notes) {
      lines.push(fold(`DESCRIPTION:${escapeIcs(entry.notes)}`));
    }
    lines.push(`URL:${SITE_URL}/diary`);
    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:TRANSPARENT");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const body = lines.join("\r\n") + "\r\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="pastoral-programme.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
