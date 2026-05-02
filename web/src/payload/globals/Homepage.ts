import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: { read: () => true },
  admin: {
    group: "Site",
    description:
      "Editable copy on the homepage hero, daily reflection block, and pull-quote section. The Archbishop's name itself is not editable here — it is part of the brand mark.",
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath("/");
      },
    ],
  },
  fields: [
    {
      name: "heroEyebrow",
      label: "Hero Eyebrow",
      type: "text",
      admin: {
        description:
          "Small uppercase label above the name, e.g. 'His Grace · Most Reverend'.",
      },
    },
    {
      name: "heroHeading",
      label: "Hero Heading (currently unused)",
      type: "text",
      admin: {
        description:
          "Reserved. The Archbishop's name is rendered as a brand mark and is not editable from here.",
      },
    },
    {
      name: "heroSubheading",
      label: "Hero Subheading",
      type: "textarea",
      admin: {
        description:
          "Italic line under the name. Year markers in the prose are kept as plain text.",
      },
    },
    {
      name: "heroImage",
      label: "Hero Photo (optional)",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Replaces /hero.avif on the homepage. Leave empty to keep the default photo.",
      },
    },
    {
      name: "dailyReflection",
      label: "Daily Reflection Quote",
      type: "richText",
      admin: {
        description:
          "Rotating quote shown in the bone band. The date stamp updates automatically — only the quote text is editable here.",
      },
    },
    {
      name: "featuredQuote",
      label: "Featured Pull Quote",
      type: "textarea",
      admin: {
        description: "Centred large quote shown near the bottom of the page.",
      },
    },
    {
      name: "featuredQuoteAttribution",
      label: "Featured Quote Attribution",
      type: "text",
      admin: {
        description: "e.g. '— Most Rev. Valerian M. Okeke'.",
      },
    },
  ],
};
