import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_newsletter_editions_status" AS ENUM('draft', 'ready_to_send', 'sending', 'sent', 'failed', 'skipped_no_posts');
  CREATE TABLE "newsletter_editions_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fb_post_id" varchar,
  	"permalink_url" varchar,
  	"created_time" timestamp(3) with time zone NOT NULL,
  	"message" varchar,
  	"image_url" varchar
  );
  
  CREATE TABLE "newsletter_editions_errors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"kind" varchar NOT NULL,
  	"message" varchar NOT NULL
  );
  
  CREATE TABLE "newsletter_editions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"edition_date" timestamp(3) with time zone NOT NULL,
  	"slug" varchar NOT NULL,
  	"subject_line" varchar NOT NULL,
  	"eyebrow" varchar,
  	"lead" varchar,
  	"html_snapshot" varchar,
  	"status" "enum_newsletter_editions_status" DEFAULT 'draft' NOT NULL,
  	"resend_broadcast_id" varchar,
  	"sent_at" timestamp(3) with time zone,
  	"sent_count" numeric,
  	"failed_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletter_editions_id" integer;
  ALTER TABLE "newsletter_editions_posts" ADD CONSTRAINT "newsletter_editions_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletter_editions_errors" ADD CONSTRAINT "newsletter_editions_errors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter_editions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletter_editions_posts_order_idx" ON "newsletter_editions_posts" USING btree ("_order");
  CREATE INDEX "newsletter_editions_posts_parent_id_idx" ON "newsletter_editions_posts" USING btree ("_parent_id");
  CREATE INDEX "newsletter_editions_errors_order_idx" ON "newsletter_editions_errors" USING btree ("_order");
  CREATE INDEX "newsletter_editions_errors_parent_id_idx" ON "newsletter_editions_errors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "newsletter_editions_slug_idx" ON "newsletter_editions" USING btree ("slug");
  CREATE INDEX "newsletter_editions_updated_at_idx" ON "newsletter_editions" USING btree ("updated_at");
  CREATE INDEX "newsletter_editions_created_at_idx" ON "newsletter_editions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_editions_fk" FOREIGN KEY ("newsletter_editions_id") REFERENCES "public"."newsletter_editions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_newsletter_editions_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_editions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_editions_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_editions_errors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_editions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "newsletter_editions_posts" CASCADE;
  DROP TABLE "newsletter_editions_errors" CASCADE;
  DROP TABLE "newsletter_editions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletter_editions_fk";
  
  DROP INDEX "payload_locked_documents_rels_newsletter_editions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletter_editions_id";
  DROP TYPE "public"."enum_newsletter_editions_status";`)
}
