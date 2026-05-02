export type PastoralVideo = {
  id: string;
  title: string;
  occasion?: string;
  date?: string;
  iso?: string;
  duration?: string;
};

// One row per recording. The grid component arranges these into a
// hover-expanding tile layout, so add new entries freely — anything from
// one to nine videos renders sensibly.
export const PASTORAL_VIDEOS: PastoralVideo[] = [
  {
    id: "ZbrwZq-54hI",
    title: "Priestly Ordination — Archdiocese of Onitsha",
    occasion: "Sacred Orders · Onitsha",
    date: "2023",
    iso: "2023-01-01",
  },
];
