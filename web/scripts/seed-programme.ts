/* eslint-disable no-console */
/**
 * One-off: push the static PROGRAMME_ENTRIES array into the Programme
 * global so the admin and storefront read from a single source of truth.
 *
 * Run with:
 *   npm run seed:programme
 *
 * The script targets whichever database the loaded .env points at, so for
 * production make sure DATABASE_URL_UNPOOLED / POSTGRES_URL_NON_POOLING is
 * the prod connection string.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";
import { PROGRAMME_ENTRIES } from "../src/data/pastoral-programme";

async function main() {
  const payload = await getPayload({ config });

  const upcoming = PROGRAMME_ENTRIES.map((entry) => ({
    date: entry.start,
    title: entry.title,
    location: entry.location ?? "",
    notes: entry.description ?? "",
  }));

  console.log(`Seeding ${upcoming.length} programme entries…`);

  await payload.updateGlobal({
    slug: "programme",
    data: { upcoming },
  });

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
