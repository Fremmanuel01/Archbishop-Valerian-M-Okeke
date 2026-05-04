import type { CollectionConfig } from "payload";
import sharp from "sharp";
import { put } from "@vercel/blob";

const MAX_LONG_EDGE = 2400;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

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
  hooks: {
    afterChange: [
      async ({ doc, req, operation, context }) => {
        if (context?.skipCompression) return doc;
        if (operation !== "create") return doc;
        if (!doc?.mimeType?.startsWith("image/")) return doc;
        if (!doc.url) return doc;
        if (!process.env.BLOB_READ_WRITE_TOKEN) return doc;

        try {
          const res = await fetch(doc.url);
          if (!res.ok) return doc;
          const original = Buffer.from(await res.arrayBuffer());

          const meta = await sharp(original).metadata();
          const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
          const needsResize = longEdge > MAX_LONG_EDGE;

          let pipeline = sharp(original).rotate();
          if (needsResize) {
            pipeline = pipeline.resize({
              width:
                meta.width && meta.width >= (meta.height ?? 0)
                  ? MAX_LONG_EDGE
                  : undefined,
              height:
                meta.height && meta.height > (meta.width ?? 0)
                  ? MAX_LONG_EDGE
                  : undefined,
              withoutEnlargement: true,
            });
          }

          const mt = doc.mimeType;
          let output: Buffer;
          let contentType = mt;
          if (mt === "image/jpeg" || mt === "image/jpg") {
            output = await pipeline
              .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
              .toBuffer();
            contentType = "image/jpeg";
          } else if (mt === "image/png") {
            output = await pipeline
              .png({ compressionLevel: 9, palette: true, quality: 90 })
              .toBuffer();
          } else if (mt === "image/webp") {
            output = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
          } else {
            // AVIF, GIF, SVG — leave alone.
            return doc;
          }

          if (output.length >= original.length) return doc;

          const pathname = new URL(doc.url).pathname.replace(/^\//, "");
          await put(pathname, output, {
            access: "public",
            contentType,
            addRandomSuffix: false,
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });

          const outMeta = needsResize ? await sharp(output).metadata() : null;
          await req.payload.update({
            collection: "media",
            id: doc.id,
            data: {
              filesize: output.length,
              ...(outMeta?.width ? { width: outMeta.width } : {}),
              ...(outMeta?.height ? { height: outMeta.height } : {}),
            },
            context: { skipCompression: true },
            req,
          });

          return {
            ...doc,
            filesize: output.length,
            ...(outMeta?.width ? { width: outMeta.width } : {}),
            ...(outMeta?.height ? { height: outMeta.height } : {}),
          };
        } catch (err) {
          req.payload.logger?.warn(
            `Media compression skipped for ${doc.id}: ${err instanceof Error ? err.message : String(err)}`,
          );
          return doc;
        }
      },
    ],
  },
};
