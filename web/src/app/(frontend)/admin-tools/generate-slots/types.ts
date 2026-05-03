export type GenerateState = {
  ok: boolean;
  message: string | null;
  created: number;
  skipped: number;
  yearGenerated: number | null;
};

export const initialGenerateState: GenerateState = {
  ok: false,
  message: null,
  created: 0,
  skipped: 0,
  yearGenerated: null,
};
