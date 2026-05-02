import type { CollectionConfig } from "payload";

export const PastoralVisits: CollectionConfig = {
  slug: "pastoral-visits",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "parish", "_status"],
    group: "Content",
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "date", type: "date", required: true },
    { name: "parish", type: "text" },
    { name: "deanery", type: "text" },
    { name: "summary", type: "textarea" },
    { name: "body", type: "richText" },
    {
      name: "images",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text" },
      ],
    },
  ],
};
