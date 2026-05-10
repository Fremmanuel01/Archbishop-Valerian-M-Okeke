import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the index on `newsletter_editions.resend_broadcast_id` so the
// Resend webhook lookup (which finds the originating edition for a
// bounce/complaint event) doesn't full-scan. The matching `slot` index
// on `appointment_bookings` is created automatically by Payload as the
// FK index, so no DDL for that one.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "newsletter_editions_resend_broadcast_id_idx"
      ON "newsletter_editions" USING btree ("resend_broadcast_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "newsletter_editions_resend_broadcast_id_idx";
  `)
}
