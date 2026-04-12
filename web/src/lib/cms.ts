const API = "https://peachpuff-tiger-996145.hostingersite.com/api";

export type PastoralLetter = {
  id: number;
  title: string;
  description: string | null;
  pdf_url: string | null;
  thumbnail_url: string | null;
  cover_photo_url: string | null;
  date: string | null;
  key_quote: string | null;
};

export type Homily = PastoralLetter & {
  occasion: string | null;
};

export type Writing = {
  id: number;
  title: string;
  body: string | null;
  category: string | null;
  occasion: string | null;
  date: string | null;
  cover_photo_url: string | null;
  pdf_url: string | null;
};

type Envelope<T> = { success: boolean; data: T };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`CMS ${path} → ${res.status}`);
  }
  const json = (await res.json()) as Envelope<T>;
  return json.data;
}

export const getPastoralLetters = () =>
  get<PastoralLetter[]>("/pastoral-letters");
export const getPastoralLetter = (id: number | string) =>
  get<PastoralLetter>(`/pastoral-letters/${id}`);

export const getHomilies = () => get<Homily[]>("/homilies");
export const getHomily = (id: number | string) =>
  get<Homily>(`/homilies/${id}`);

export const getWritings = () => get<Writing[]>("/writings");
export const getWriting = (id: number | string) =>
  get<Writing>(`/writings/${id}`);

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function yearOf(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const y = Number(isoDate.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

export function formatLongDate(isoDate: string | null): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
