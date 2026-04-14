export type PastoralVideo = {
  id: string;
  title: string;
  occasion: string;
  date: string;
  iso: string;
  duration: string;
};

export const FEATURED_VIDEO: PastoralVideo = {
  id: "ZbrwZq-54hI",
  title: "Chrism Mass at the Basilica of the Most Holy Trinity",
  occasion: "Holy Thursday · Onitsha",
  date: "02 April 2026",
  iso: "2026-04-02",
  duration: "48:12",
};

export const QUEUED_VIDEOS: PastoralVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Confirmation Mass at Our Lady's, Nnobi",
    occasion: "Pastoral Visit",
    date: "14 March 2026",
    iso: "2026-03-14",
    duration: "1:12:40",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Address to Seminarians of St Joseph's, Awka-Etiti",
    occasion: "Formation",
    date: "28 March 2026",
    iso: "2026-03-28",
    duration: "22:05",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Ordination of Deacons — Holy Trinity Cathedral",
    occasion: "Sacred Orders",
    date: "21 February 2026",
    iso: "2026-02-21",
    duration: "2:04:18",
  },
];
