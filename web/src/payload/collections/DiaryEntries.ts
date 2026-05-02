import type { CollectionConfig } from "payload";

export const DiaryEntries: CollectionConfig = {
  slug: "diary-entries",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location", "_status"],
    group: "Content",
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
