import type { CollectionConfig } from "payload";

// Sliding-window rate-limit ledger. Each row is a single hit recorded
// against a `key` (typically `<action>:<ip>` or `<action>:<email>`); the
// helper in `lib/rate-limit.ts` counts unexpired rows for the same key
// and blocks if the count crosses the threshold for the time window.
//
// The collection is admin-internal and should not be exposed via the
// public API or the admin UI navigation. We hide it from the navigation
// but leave read access open to logged-in admins for diagnostics.
export const RateLimits: CollectionConfig = {
  slug: "rate-limits",
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "createdAt", "expiresAt"],
    group: "System",
    description:
      "Internal sliding-window ledger backing rate-limit checks on public form submissions. Rows expire automatically — admins should not edit by hand.",
    hidden: ({ user }) =>
      !user || (user as { role?: string }).role !== "admin",
  },
  access: {
    // No public reads — only signed-in admins. The helper writes via the
    // server-side payload client, which bypasses access control anyway.
    read: ({ req: { user } }) =>
      Boolean(user && (user as { role?: string }).role === "admin"),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) =>
      Boolean(user && (user as { role?: string }).role === "admin"),
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      index: true,
      admin: {
        description:
          "Composite key — typically `<action>:<ip-or-email>`. Multiple rows per key are expected; the helper counts them within the window.",
      },
    },
    {
      name: "expiresAt",
      type: "date",
      required: true,
      index: true,
      admin: {
        description:
          "When this hit drops out of the sliding window. Older rows are pruned opportunistically on each check.",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
  ],
};
