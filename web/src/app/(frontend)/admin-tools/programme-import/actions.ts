"use server";

import { revalidatePath } from "next/cache";
import Papa from "papaparse";
import { getPayloadClient } from "@/lib/payload";
import { ADMIN_ONLY, requireRole } from "@/lib/admin-auth";
import type { ImportState } from "./types";

type ProgrammeRow = {
  date: string;
  title: string;
  location?: string;
  notes?: string;
};

type CsvRow = Record<string, string | undefined>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function normaliseHeader(key: string): string {
  return key.trim().toLowerCase();
}

function normaliseDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (ISO_DATE.test(trimmed)) return trimmed;
  // Try common alternatives: DD/MM/YYYY, MM/DD/YYYY (assume DD/MM for UK style)
  const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // Try natural language via Date parser as last resort.
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return null;
}

export async function importProgramme(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const auth = await requireRole(ADMIN_ONLY);
  if (!auth.ok) {
    return {
      ok: false,
      message:
        auth.reason === "unauthenticated"
          ? "You must be signed in to /admin to use this tool."
          : "Your account does not have admin role.",
      added: 0,
      total: 0,
      skipped: [],
    };
  }
  const payload = await getPayloadClient();

  const file = formData.get("file");
  const mode = formData.get("mode")?.toString() ?? "append";
  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      message: "Please choose a CSV file to upload.",
      added: 0,
      total: 0,
      skipped: [],
    };
  }
  if (file.size > 1024 * 1024) {
    return {
      ok: false,
      message: "CSV must be smaller than 1 MB.",
      added: 0,
      total: 0,
      skipped: [],
    };
  }

  const text = await file.text();
  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normaliseHeader,
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    return {
      ok: false,
      message: `CSV could not be parsed: ${parsed.errors[0].message}`,
      added: 0,
      total: 0,
      skipped: [],
    };
  }

  const valid: ProgrammeRow[] = [];
  const skipped: ImportState["skipped"] = [];

  parsed.data.forEach((row, idx) => {
    const rowNum = idx + 2; // +1 for header, +1 for human-friendly index
    const dateRaw = (row.date ?? row.start ?? "").toString();
    const titleRaw = (row.title ?? "").toString();
    const date = normaliseDate(dateRaw);
    const title = titleRaw.trim();
    if (!date) {
      skipped.push({ row: rowNum, reason: `bad date: "${dateRaw}"` });
      return;
    }
    if (!title) {
      skipped.push({ row: rowNum, reason: "missing title" });
      return;
    }
    valid.push({
      date,
      title,
      location: (row.location ?? "").toString().trim() || undefined,
      notes:
        (row.notes ?? row.description ?? row.note ?? "").toString().trim() ||
        undefined,
    });
  });

  if (valid.length === 0) {
    return {
      ok: false,
      message: "No valid rows found. The CSV needs at least 'date' and 'title' columns.",
      added: 0,
      total: parsed.data.length,
      skipped,
    };
  }

  const existing = await payload.findGlobal({
    slug: "programme",
    depth: 0,
  });
  const existingUpcoming = Array.isArray(existing.upcoming)
    ? (existing.upcoming as Array<{
        date?: string;
        title?: string;
        location?: string;
        notes?: string;
      }>)
    : [];

  const merged: ProgrammeRow[] =
    mode === "replace"
      ? valid
      : [
          ...existingUpcoming.map((e) => ({
            date: typeof e.date === "string" ? e.date.slice(0, 10) : "",
            title: e.title ?? "",
            location: e.location || undefined,
            notes: e.notes || undefined,
          })),
          ...valid,
        ];

  // Sort chronologically — keeps the admin list and the storefront
  // calendar tidy whatever order rows were uploaded in.
  merged.sort((a, b) => a.date.localeCompare(b.date));

  await payload.updateGlobal({
    slug: "programme",
    data: { upcoming: merged },
  });

  try {
    revalidatePath("/diary");
    revalidatePath("/");
  } catch {
    /* ignore — same reason as the global hook. */
  }

  return {
    ok: true,
    message:
      mode === "replace"
        ? `Replaced the programme with ${valid.length} entr${valid.length === 1 ? "y" : "ies"}.`
        : `Appended ${valid.length} entr${valid.length === 1 ? "y" : "ies"} (${merged.length} total).`,
    added: valid.length,
    total: parsed.data.length,
    skipped,
  };
}
