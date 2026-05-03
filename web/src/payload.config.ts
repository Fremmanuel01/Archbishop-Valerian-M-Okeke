import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { DiaryEntries } from "./payload/collections/DiaryEntries";
import { PastoralVisits } from "./payload/collections/PastoralVisits";
import { GalleryImages } from "./payload/collections/GalleryImages";
import { BiographySections } from "./payload/collections/BiographySections";
import { FeaturedVideos } from "./payload/collections/FeaturedVideos";
import { AppointmentSlots } from "./payload/collections/AppointmentSlots";
import { AppointmentBookings } from "./payload/collections/AppointmentBookings";
import { Homepage } from "./payload/globals/Homepage";
import { Programme } from "./payload/globals/Programme";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const payloadSecret = (() => {
  const value = process.env.PAYLOAD_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "PAYLOAD_SECRET environment variable is required in production",
    );
  }
  return "dev-secret-change-me";
})();

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · CADO ICT Admin",
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    DiaryEntries,
    PastoralVisits,
    GalleryImages,
    BiographySections,
    FeaturedVideos,
    AppointmentSlots,
    AppointmentBookings,
  ],
  globals: [Homepage, Programme],
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL_UNPOOLED ??
        process.env.POSTGRES_URL_NON_POOLING ??
        process.env.DATABASE_URL ??
        process.env.POSTGRES_URL,
    },
    // TODO(phase 8): switch to managed migrations (`payload migrate:create`,
    // `payload migrate`) once the schema settles. Until then, push the schema
    // directly so the first production boot can create its own tables.
    push: true,
  }),
  plugins: [
    vercelBlobStorage({
      // Local dev without a Blob token falls back to the default static
      // upload behaviour. In production the token MUST be set or uploads
      // will be written to the ephemeral serverless filesystem and lost
      // on the next deploy.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        [Media.slug]: {
          // Browser uploads directly to Vercel Blob instead of routing
          // through /api/media. Required because Vercel serverless
          // functions cap request bodies at 4.5 MB and Sharp resizing
          // amplifies that further.
          clientUploads: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
  sharp,
});
