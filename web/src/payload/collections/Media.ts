import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "Content",
  },
  upload: {
    // Files are uploaded directly to Vercel Blob (clientUploads on the
    // adapter), so Payload never holds the bytes server-side. That means
    // Sharp can't generate imageSizes variants — and we don't need them
    // anyway: every consumer of these images on the storefront goes
    // through next/image, which resizes on demand at the CDN edge.
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "credit",
      type: "text",
    },
  ],
};
