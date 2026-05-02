import type { CollectionConfig } from "payload";

export const BiographySections: CollectionConfig = {
  slug: "biography-sections",
  access: { read: () => true },
  admin: {
    useAsTitle: "heading",
    defaultColumns: ["heading", "order", "_status"],
    group: "Content",
  },
  versions: { drafts: true },
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "eyebrow", type: "text" },
    { name: "order", type: "number", defaultValue: 0 },
    { name: "body", type: "richText" },
  ],
};
