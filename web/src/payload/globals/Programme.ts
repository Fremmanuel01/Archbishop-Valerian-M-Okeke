import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";

export const Programme: GlobalConfig = {
  slug: "programme",
  access: { read: () => true },
  admin: {
    group: "Site",
    description:
      "The Pastoral Programme rendered on /diary. Add an entry per Mass, visit, ordination, or meeting.",
  },
  hooks: {
    afterChange: [
      () => {
        // Programme drives both the /diary calendar AND the homepage
        // "Recent Engagements" section. Revalidate both so admin edits
        // propagate within seconds.
        revalidatePath("/diary");
        revalidatePath("/");
      },
    ],
  },
  fields: [
    {
      name: "upcoming",
      label: "Programme Entries",
      type: "array",
      labels: { singular: "Entry", plural: "Entries" },
      admin: {
        description:
          "One row per engagement. Storefront category is derived from the title (Mass / Pastoral Visit / Meeting / Ordination / Retreat / Special); colour-coded automatically.",
      },
      fields: [
        { name: "date", type: "date", required: true },
        { name: "title", type: "text", required: true },
        { name: "location", type: "text" },
        { name: "notes", type: "textarea" },
      ],
    },
  ],
};
