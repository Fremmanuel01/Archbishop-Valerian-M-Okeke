// Data access layer for the Pastoral Programme.
// TODO(phase 8): replace the static imports below with a fetch against the
// admin-editable CMS endpoint. All callers use these async functions, so the
// page code will not need to change.
import {
  PROGRAMME_ENTRIES,
  PROGRAMME_YEAR,
  type ProgrammeEntry,
} from "@/data/pastoral-programme";

export type { ProgrammeEntry, ProgrammeCategory } from "@/data/pastoral-programme";

export async function getProgrammeEntries(): Promise<ProgrammeEntry[]> {
  return PROGRAMME_ENTRIES;
}

export async function getProgrammeYear(): Promise<number> {
  return PROGRAMME_YEAR;
}
