import type { MetadataRoute } from "next";
import { getPastoralLetters, slugify } from "@/lib/cms";

const BASE = "https://archbishop-valerian-m-okeke.vercel.app";

const STATIC_ROUTES = [
  "",
  "/biography",
  "/his-episcopacy",
  "/coat-of-arms",
  "/pastoral-letters",
  "/reflections",
  "/messages",
  "/other-teachings",
  "/diary",
  "/pastoral-visits",
  "/connect",
  "/connect/prayer-requests",
  "/connect/contact",
  "/connect/newsletter",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let letterEntries: MetadataRoute.Sitemap = [];
  try {
    const letters = await getPastoralLetters();
    letterEntries = letters.map((letter) => ({
      url: `${BASE}/pastoral-letters/${letter.id}-${slugify(letter.title)}`,
      lastModified: letter.date ? new Date(letter.date) : now,
      changeFrequency: "yearly",
      priority: 0.8,
    }));
  } catch {
    // CMS unavailable at build; ship static entries only
  }

  return [...staticEntries, ...letterEntries];
}
