import type { GlobalConfig } from "payload";

export const Programme: GlobalConfig = {
  slug: "programme",
  access: { read: () => true },
  admin: { group: "Site" },
  fields: [
    {
      name: "upcoming",
      type: "array",
      fields: [
        { name: "date", type: "date", required: true },
        { name: "title", type: "text", required: true },
        { name: "location", type: "text" },
        { name: "notes", type: "textarea" },
      ],
    },
  ],
};
