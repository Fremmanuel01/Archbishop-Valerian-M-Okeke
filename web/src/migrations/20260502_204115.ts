import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_featured_videos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__featured_videos_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "featured_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"youtube_id" varchar,
  	"occasion" varchar,
  	"date" timestamp(3) with time zone,
  	"duration" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_featured_videos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_featured_videos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_youtube_id" varchar,
  	"version_occasion" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_duration" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__featured_videos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "featured_videos_id" integer;
  ALTER TABLE "_featured_videos_v" ADD CONSTRAINT "_featured_videos_v_parent_id_featured_videos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."featured_videos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "featured_videos_updated_at_idx" ON "featured_videos" USING btree ("updated_at");
  CREATE INDEX "featured_videos_created_at_idx" ON "featured_videos" USING btree ("created_at");
  CREATE INDEX "featured_videos__status_idx" ON "featured_videos" USING btree ("_status");
  CREATE INDEX "_featured_videos_v_parent_idx" ON "_featured_videos_v" USING btree ("parent_id");
  CREATE INDEX "_featured_videos_v_version_version_updated_at_idx" ON "_featured_videos_v" USING btree ("version_updated_at");
  CREATE INDEX "_featured_videos_v_version_version_created_at_idx" ON "_featured_videos_v" USING btree ("version_created_at");
  CREATE INDEX "_featured_videos_v_version_version__status_idx" ON "_featured_videos_v" USING btree ("version__status");
  CREATE INDEX "_featured_videos_v_created_at_idx" ON "_featured_videos_v" USING btree ("created_at");
  CREATE INDEX "_featured_videos_v_updated_at_idx" ON "_featured_videos_v" USING btree ("updated_at");
  CREATE INDEX "_featured_videos_v_latest_idx" ON "_featured_videos_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_featured_videos_fk" FOREIGN KEY ("featured_videos_id") REFERENCES "public"."featured_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_featured_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("featured_videos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "featured_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_featured_videos_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "featured_videos" CASCADE;
  DROP TABLE "_featured_videos_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_featured_videos_fk";
  
  DROP INDEX "payload_locked_documents_rels_featured_videos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "featured_videos_id";
  DROP TYPE "public"."enum_featured_videos_status";
  DROP TYPE "public"."enum__featured_videos_v_version_status";`)
}
