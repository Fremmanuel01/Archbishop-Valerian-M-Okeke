import type { MetadataRoute } from "next";

const BASE = "https://archbishop-valerian-m-okeke.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
