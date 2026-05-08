import type { CollectionConfig } from "payload";

// Monthly "Pastoral Diary" newsletter editions.
//
// Each edition represents one calendar month. The cron handler at
// /api/cron/newsletter creates the draft on the 28th, an admin reviews it
// in the Payload admin, then triggers the actual send via the
// /admin-tools/send-newsletter page (server action → Resend Broadcasts).
//
// The edition record is the archival source of truth: it stores the
// posts pulled from the FB page, the rendered HTML at send-time, and
// the resulting Resend broadcast id + send counts.
//
// Approval is the default: nothing leaves this collection automatically.
// The cron only escalates by emailing admin@ on the last day of the
// month if status is still draft / ready_to_send.

const STATUS_OPTIONS = [
  { label: "Draft (in progress)", value: "draft" },
  { label: "Ready to send (approved)", value: "ready_to_send" },
  { label: "Sending…", value: "sending" },
  { label: "Sent", value: "sent" },
  { label: "Failed", value: "failed" },
  { label: "Skipped — no posts this month", value: "skipped_no_posts" },
] as const;

export const NewsletterEditions: CollectionConfig = {
  slug: "newsletter-editions",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "subjectLine",
    defaultColumns: ["editionDate", "subjectLine", "status", "sentAt", "sentCount"],
    group: "Newsletter",
    description:
      "Monthly Pastoral Diary editions. Drafts are auto-generated on the 28th by the cron. Review posts, edit copy if needed, set status to 'Ready to send (approved)', then trigger the send from /admin-tools/send-newsletter.",
  },
  fields: [
    {
      name: "editionDate",
      type: "date",
      required: true,
      admin: {
        description:
          "The first day of the month this edition covers. e.g. 1 May 2026 for the May 2026 edition.",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" },
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Auto-derived from editionDate (e.g. 'may-2026'). Editable but uniqueness is enforced.",
      },
    },
    {
      name: "subjectLine",
      type: "text",
      required: true,
      admin: {
        description: "The email subject. e.g. 'Pastoral Diary · May 2026'.",
      },
    },
    {
      name: "eyebrow",
      type: "text",
      admin: {
        description:
          "Small uppercase label above the heading, e.g. 'PASTORAL DIARY · MMXXVI · MAY'.",
      },
    },
    {
      name: "lead",
      type: "textarea",
      admin: {
        description:
          "Italic subhead under the display heading. One short sentence describing what this month's diary covers.",
      },
    },
    {
      name: "posts",
      type: "array",
      labels: { singular: "Post", plural: "Posts" },
      admin: {
        description:
          "Posts pulled from the FB page (chronological). The first post is the lead — it gets the full-bleed photo treatment.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "fbPostId",
          type: "text",
          admin: { description: "Facebook post id (for de-duplication)." },
        },
        {
          name: "permalinkUrl",
          type: "text",
          admin: { description: "Public Facebook permalink to the post." },
        },
        {
          name: "createdTime",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
              displayFormat: "d MMM yyyy · HH:mm",
            },
          },
        },
        {
          name: "message",
          type: "textarea",
          admin: {
            description:
              "Post text from the FB caption. Edited copy is OK — this is what readers will see in the email.",
          },
        },
        {
          name: "originalMessage",
          type: "textarea",
          admin: {
            description:
              "Raw FB caption as fetched, preserved so 'Reset to original' and 'Rewrite editorially' can both reference it. Read-only.",
            readOnly: true,
          },
        },
        {
          name: "imageUrl",
          type: "text",
          admin: {
            description:
              "Permanent image URL (mirrored from FB to Vercel Blob). Empty if the post has no image.",
          },
        },
      ],
    },
    {
      name: "htmlSnapshot",
      type: "textarea",
      admin: {
        description:
          "Final HTML rendered at send-time. Read-only — populated by the send action.",
        readOnly: true,
        rows: 4,
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: STATUS_OPTIONS as unknown as { label: string; value: string }[],
    },
    {
      name: "resendBroadcastId",
      type: "text",
      admin: {
        readOnly: true,
        description: "Resend Broadcast id, set on first successful create call.",
      },
    },
    {
      name: "sentAt",
      type: "date",
      admin: {
        readOnly: true,
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy · HH:mm" },
      },
    },
    {
      name: "sentCount",
      type: "number",
      admin: { readOnly: true, description: "Audience size at send-time." },
    },
    {
      name: "failedCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: "errors",
      type: "array",
      admin: {
        description: "Structured errors logged during draft creation or send.",
        readOnly: true,
        initCollapsed: true,
      },
      fields: [
        { name: "at", type: "date", required: true },
        { name: "kind", type: "text", required: true },
        { name: "message", type: "textarea", required: true },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-derive slug from editionDate if missing or stale.
        if (data?.editionDate && !data.slug) {
          const d = new Date(data.editionDate);
          if (!Number.isNaN(d.getTime())) {
            const month = d.toLocaleString("en-US", {
              month: "long",
              timeZone: "UTC",
            }).toLowerCase();
            data.slug = `${month}-${d.getUTCFullYear()}`;
          }
        }
        return data;
      },
    ],
  },
};
