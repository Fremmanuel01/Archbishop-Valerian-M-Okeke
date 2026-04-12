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
