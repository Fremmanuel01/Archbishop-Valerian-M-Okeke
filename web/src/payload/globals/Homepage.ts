import type { GlobalConfig } from "payload";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: { read: () => true },
  admin: { group: "Site" },
  fields: [
    { name: "heroEyebrow", type: "text" },
    { name: "heroHeading", type: "text" },
    { name: "heroSubheading", type: "textarea" },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    { name: "dailyReflection", type: "richText" },
    { name: "featuredQuote", type: "textarea" },
    { name: "featuredQuoteAttribution", type: "text" },
  ],
};
