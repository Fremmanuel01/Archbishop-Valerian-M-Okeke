import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";

export const DiaryEntries: CollectionConfig = {
  slug: "diary-entries",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location", "_status"],
    group: "Content",
    description:
      "Recent engagements shown on the homepage. The latest three published entries (sorted by date, newest first) appear in the 'Recent Engagements' section.",
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath("/");
      },
    ],
    afterDelete: [
      () => {
        revalidatePath("/");
      },
    ],
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "date", type: "date", required: true },
    { name: "location", type: "text" },
    { name: "excerpt", type: "textarea" },
    { name: "body", type: "richText" },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
  ],
};
