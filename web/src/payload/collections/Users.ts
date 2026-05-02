import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Staff",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
