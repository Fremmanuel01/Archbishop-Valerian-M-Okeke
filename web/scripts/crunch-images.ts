/* eslint-disable no-console */
/**
 * Crunch every JPG / PNG / WebP under web/public so the storefront
 * loads quickly without losing visual quality. Runs in place — make
 * sure your changes are committed before running so you can diff.
 *
 *   npm run crunch:images               # crunches every supported file
 *   npm run crunch:images -- public/x.jpg  # one file
 *   npm run crunch:images -- --dry-run     # show savings without writing
 *
 * Targets:
 *   - JPG / JPEG: re-encode with mozjpeg quality 82, strip metadata,
 *     downsize to max 2400px on the long edge.
 *   - PNG: re-encode (palette + zlib max). Kept as PNG so transparency
 *     and the diocesan crest stay crisp.
 *   - WebP: re-encode at quality 82.
 *   - AVIF: skipped — already optimal.
 *
 * Pastoral-letter legacy PDFs and the gallery folder are included
 * because they're shipped statically. Skip explicitly with
 *   --skip public/some/folder
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(import.meta.dirname, "..", "public");
const MAX_LONG_EDGE = 2400;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const explicitTargets = args.filter(
  (a) => !a.startsWith("--") && !a.startsWith("-"),
);
const skipFlag = args.indexOf("--skip");
const skip =
  skipFlag !== -1 ? args[skipFlag + 1] : undefined;

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skip && p.includes(skip)) continue;
      yield* walk(p);
    } else if (entry.isFile()) {
      yield p;
    }
  }
}

function format(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function crunchOne(file: string): Promise<{ before: number; after: number; touched: boolean }> {
  const ext = path.extname(file).toLowerCase();
  const supported = [".jpg", ".jpeg", ".png", ".webp"];
  if (!supported.includes(ext)) {
    return { before: 0, after: 0, touched: false };
  }

  const original = await readFile(file);
  const before = original.length;

  const meta = await sharp(original).metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  const needsResize = longEdge > MAX_LONG_EDGE;

  let pipeline = sharp(original).rotate(); // honour EXIF rotation
  if (needsResize) {
    pipeline = pipeline.resize({
      width: meta.width && meta.width >= (meta.height ?? 0) ? MAX_LONG_EDGE : undefined,
      height: meta.height && meta.height > (meta.width ?? 0) ? MAX_LONG_EDGE : undefined,
      withoutEnlargement: true,
    });
  }

  let outputBuffer: Buffer;
  if (ext === ".jpg" || ext === ".jpeg") {
    outputBuffer = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();
  } else if (ext === ".png") {
    outputBuffer = await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toBuffer();
  } else if (ext === ".webp") {
    outputBuffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  } else {
    return { before, after: before, touched: false };
  }

  const after = outputBuffer.length;
  if (after >= before) {
    // Re-encode produced something larger; leave the original alone.
    return { before, after: before, touched: false };
  }

  if (!dryRun) {
    await writeFile(file, outputBuffer);
  }
  return { before, after, touched: true };
}

async function main() {
  const targets: string[] = [];
  if (explicitTargets.length > 0) {
    for (const t of explicitTargets) {
      const abs = path.resolve(t);
      const s = await stat(abs).catch(() => null);
      if (!s) {
        console.error(`Skipping (not found): ${t}`);
        continue;
      }
      if (s.isDirectory()) {
        for await (const f of walk(abs)) targets.push(f);
      } else {
        targets.push(abs);
      }
    }
  } else {
    for await (const f of walk(PUBLIC_DIR)) targets.push(f);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let touchedCount = 0;
  let skippedCount = 0;
  const rows: Array<{ file: string; before: number; after: number }> = [];

  for (const file of targets) {
    const result = await crunchOne(file);
    if (result.before === 0) {
      skippedCount++;
      continue;
    }
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.touched) {
      touchedCount++;
      rows.push({
        file: path.relative(process.cwd(), file),
        before: result.before,
        after: result.after,
      });
    }
  }

  rows.sort((a, b) => b.before - b.after - (a.before - a.after));

  console.log(`\n${dryRun ? "[dry-run] " : ""}Crunched ${touchedCount} of ${touchedCount + skippedCount} candidates.\n`);
  for (const row of rows) {
    const saved = row.before - row.after;
    const pct = Math.round((saved / row.before) * 100);
    console.log(
      `  ${format(row.before).padStart(8)}  →  ${format(row.after).padStart(8)}  (-${pct}%)   ${row.file}`,
    );
  }
  const saved = totalBefore - totalAfter;
  const pct = totalBefore > 0 ? Math.round((saved / totalBefore) * 100) : 0;
  console.log(`\nTotal: ${format(totalBefore)} → ${format(totalAfter)}  (saved ${format(saved)}, -${pct}%)`);
  if (dryRun) {
    console.log("\n--dry-run: nothing was written. Re-run without --dry-run to apply.\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
