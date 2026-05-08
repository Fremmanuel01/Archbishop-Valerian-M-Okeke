import type { CollectionConfig } from "payload";

// Role values consumed by server-side gates. `admin` keeps full access to
// every collection and admin-tools page; `newsletter_editor` is scoped to
// the monthly Pastoral Diary editor + send pipeline. Any user without a
// matching role for a gated action gets a 403-like response.
export const USER_ROLES = ["admin", "newsletter_editor"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Staff",
    defaultColumns: ["email", "name", "role"],
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Admin (full access)", value: "admin" },
        {
          label: "Newsletter editor (Pastoral Diary only)",
          value: "newsletter_editor",
        },
      ],
      admin: {
        description:
          "Controls which admin-tools pages and server actions this user can use. Admin = unrestricted; Newsletter editor = only the monthly Pastoral Diary editor + send pipeline.",
      },
    },
  ],
};
