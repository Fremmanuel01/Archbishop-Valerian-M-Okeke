import type { CollectionConfig } from "payload";

export const GalleryImages: CollectionConfig = {
  slug: "gallery-images",
  access: { read: () => true },
  admin: {
    useAsTitle: "caption",
    defaultColumns: ["caption", "category", "order"],
    group: "Content",
  },
  fields: [
    { name: "caption", type: "text", required: true },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Liturgical", value: "liturgical" },
        { label: "Pastoral", value: "pastoral" },
        { label: "Portraits", value: "portraits" },
        { label: "Episcopal", value: "episcopal" },
        { label: "Vatican", value: "vatican" },
      ],
    },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};
