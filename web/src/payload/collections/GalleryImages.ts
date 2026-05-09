import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";

export const GalleryImages: CollectionConfig = {
  slug: "gallery-images",
  access: { read: () => true },
  admin: {
    useAsTitle: "caption",
    defaultColumns: ["caption", "category", "order"],
    group: "Content",
    description:
      "Photographs displayed on /photo-gallery, ordered by the 'order' field (lower numbers first). Add a caption; it serves as alt text for accessibility.",
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath("/photo-gallery");
      },
    ],
    afterDelete: [
      () => {
        revalidatePath("/photo-gallery");
      },
    ],
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
