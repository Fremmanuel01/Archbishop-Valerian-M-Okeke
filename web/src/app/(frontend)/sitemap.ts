import type { MetadataRoute } from "next";
import {
  getPastoralLetters,
  getHomilies,
  getMessages,
  slugify,
} from "@/lib/cms";
import { getSentEditions } from "@/lib/newsletter-archive";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

const STATIC_ROUTES = [
  "",
  "/biography",
  "/his-episcopacy",
  "/coat-of-arms",
  "/photo-gallery",
  "/pastoral-letters",
  "/reflections",
  "/messages",
  "/other-teachings",
  "/diary",
  "/diary/newsletter",
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

  const [letters, homilies, messages, editions] = await Promise.all([
    getPastoralLetters(),
    getHomilies(),
    getMessages(),
    getSentEditions().catch(() => []),
  ]);

  const letterEntries: MetadataRoute.Sitemap = letters.map((letter) => ({
    url: `${BASE}/pastoral-letters/${letter.id}-${slugify(letter.title)}`,
    lastModified: letter.date ? new Date(letter.date) : now,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const homilyEntries: MetadataRoute.Sitemap = homilies.map((homily) => ({
    url: `${BASE}/reflections/${homily.id}-${slugify(homily.title)}`,
    lastModified: homily.date ? new Date(homily.date) : now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const messageEntries: MetadataRoute.Sitemap = messages.map((message) => ({
    url: `${BASE}/messages/${message.id}-${slugify(message.title)}`,
    lastModified: message.date ? new Date(message.date) : now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const editionEntries: MetadataRoute.Sitemap = editions.map((edition) => ({
    url: `${BASE}/diary/newsletter/${edition.slug}`,
    lastModified: edition.sentAt
      ? new Date(edition.sentAt)
      : edition.editionDate
        ? new Date(edition.editionDate)
        : now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...letterEntries,
    ...homilyEntries,
    ...messageEntries,
    ...editionEntries,
  ];
}
