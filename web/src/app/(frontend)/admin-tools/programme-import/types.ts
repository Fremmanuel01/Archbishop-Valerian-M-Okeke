export type ImportState = {
  ok: boolean;
  message: string | null;
  added: number;
  total: number;
  skipped: Array<{ row: number; reason: string }>;
};

export const initialImportState: ImportState = {
  ok: false,
  message: null,
  added: 0,
  total: 0,
  skipped: [],
};
