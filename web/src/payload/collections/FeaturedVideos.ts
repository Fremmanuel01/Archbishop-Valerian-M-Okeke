import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";

export const FeaturedVideos: CollectionConfig = {
  slug: "featured-videos",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "youtubeId", "occasion", "date", "order", "_status"],
    group: "Content",
    description:
      "Pastoral videos shown in the homepage 'Pastoral Activities in Motion' grid. Up to nine entries are rendered, ordered by the 'order' field (lower first).",
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath("/");
      },
    ],
    afterDelete: [
      () => {
        revalidatePath("/");
      },
    ],
  },
  versions: { drafts: true },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "youtubeId",
      label: "YouTube ID",
      type: "text",
      required: true,
      admin: {
        description:
          "The 11-character video ID from the YouTube URL (e.g. 'ZbrwZq-54hI' from https://youtu.be/ZbrwZq-54hI). Do NOT paste the full URL.",
      },
    },
    {
      name: "occasion",
      type: "text",
      admin: {
        description: "Small uppercase eyebrow above the title, e.g. 'Sacred Orders · Onitsha'.",
      },
    },
    {
      name: "date",
      type: "date",
      admin: {
        description:
          "Optional. Formatted as 'Month Year' on the tile. Leave blank if no specific date applies.",
      },
    },
    {
      name: "duration",
      type: "text",
      admin: {
        description: "Optional, e.g. '1:12:40'. Shows in the bottom-right corner of the tile.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first in the grid. Use the same number for ties; ties resolve by creation order.",
      },
    },
  ],
};
