import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_diary_entries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__diary_entries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pastoral_visits_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pastoral_visits_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_gallery_images_category" AS ENUM('liturgical', 'pastoral', 'portraits', 'episcopal', 'vatican');
  CREATE TYPE "public"."enum_biography_sections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__biography_sections_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "diary_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"location" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_diary_entries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_diary_entries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_cover_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__diary_entries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pastoral_visits_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pastoral_visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"parish" varchar,
  	"deanery" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pastoral_visits_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pastoral_visits_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pastoral_visits_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_parish" varchar,
  	"version_deanery" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pastoral_visits_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "gallery_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar NOT NULL,
  	"category" "enum_gallery_images_category",
  	"order" numeric DEFAULT 0,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "biography_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"eyebrow" varchar,
  	"order" numeric DEFAULT 0,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_biography_sections_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_biography_sections_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_heading" varchar,
  	"version_eyebrow" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__biography_sections_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"diary_entries_id" integer,
  	"pastoral_visits_id" integer,
  	"gallery_images_id" integer,
  	"biography_sections_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_subheading" varchar,
  	"hero_image_id" integer,
  	"daily_reflection" jsonb,
  	"featured_quote" varchar,
  	"featured_quote_attribution" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "programme_upcoming" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"notes" varchar
  );
  
  CREATE TABLE "programme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "diary_entries" ADD CONSTRAINT "diary_entries_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_diary_entries_v" ADD CONSTRAINT "_diary_entries_v_parent_id_diary_entries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."diary_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_diary_entries_v" ADD CONSTRAINT "_diary_entries_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pastoral_visits_images" ADD CONSTRAINT "pastoral_visits_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pastoral_visits_images" ADD CONSTRAINT "pastoral_visits_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pastoral_visits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastoral_visits_v_version_images" ADD CONSTRAINT "_pastoral_visits_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pastoral_visits_v_version_images" ADD CONSTRAINT "_pastoral_visits_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pastoral_visits_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastoral_visits_v" ADD CONSTRAINT "_pastoral_visits_v_parent_id_pastoral_visits_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pastoral_visits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_biography_sections_v" ADD CONSTRAINT "_biography_sections_v_parent_id_biography_sections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."biography_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_diary_entries_fk" FOREIGN KEY ("diary_entries_id") REFERENCES "public"."diary_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pastoral_visits_fk" FOREIGN KEY ("pastoral_visits_id") REFERENCES "public"."pastoral_visits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_images_fk" FOREIGN KEY ("gallery_images_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_biography_sections_fk" FOREIGN KEY ("biography_sections_id") REFERENCES "public"."biography_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programme_upcoming" ADD CONSTRAINT "programme_upcoming_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programme"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "diary_entries_cover_image_idx" ON "diary_entries" USING btree ("cover_image_id");
  CREATE INDEX "diary_entries_updated_at_idx" ON "diary_entries" USING btree ("updated_at");
  CREATE INDEX "diary_entries_created_at_idx" ON "diary_entries" USING btree ("created_at");
  CREATE INDEX "diary_entries__status_idx" ON "diary_entries" USING btree ("_status");
  CREATE INDEX "_diary_entries_v_parent_idx" ON "_diary_entries_v" USING btree ("parent_id");
  CREATE INDEX "_diary_entries_v_version_version_cover_image_idx" ON "_diary_entries_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_diary_entries_v_version_version_updated_at_idx" ON "_diary_entries_v" USING btree ("version_updated_at");
  CREATE INDEX "_diary_entries_v_version_version_created_at_idx" ON "_diary_entries_v" USING btree ("version_created_at");
  CREATE INDEX "_diary_entries_v_version_version__status_idx" ON "_diary_entries_v" USING btree ("version__status");
  CREATE INDEX "_diary_entries_v_created_at_idx" ON "_diary_entries_v" USING btree ("created_at");
  CREATE INDEX "_diary_entries_v_updated_at_idx" ON "_diary_entries_v" USING btree ("updated_at");
  CREATE INDEX "_diary_entries_v_latest_idx" ON "_diary_entries_v" USING btree ("latest");
  CREATE INDEX "pastoral_visits_images_order_idx" ON "pastoral_visits_images" USING btree ("_order");
  CREATE INDEX "pastoral_visits_images_parent_id_idx" ON "pastoral_visits_images" USING btree ("_parent_id");
  CREATE INDEX "pastoral_visits_images_image_idx" ON "pastoral_visits_images" USING btree ("image_id");
  CREATE INDEX "pastoral_visits_updated_at_idx" ON "pastoral_visits" USING btree ("updated_at");
  CREATE INDEX "pastoral_visits_created_at_idx" ON "pastoral_visits" USING btree ("created_at");
  CREATE INDEX "pastoral_visits__status_idx" ON "pastoral_visits" USING btree ("_status");
  CREATE INDEX "_pastoral_visits_v_version_images_order_idx" ON "_pastoral_visits_v_version_images" USING btree ("_order");
  CREATE INDEX "_pastoral_visits_v_version_images_parent_id_idx" ON "_pastoral_visits_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_pastoral_visits_v_version_images_image_idx" ON "_pastoral_visits_v_version_images" USING btree ("image_id");
  CREATE INDEX "_pastoral_visits_v_parent_idx" ON "_pastoral_visits_v" USING btree ("parent_id");
  CREATE INDEX "_pastoral_visits_v_version_version_updated_at_idx" ON "_pastoral_visits_v" USING btree ("version_updated_at");
  CREATE INDEX "_pastoral_visits_v_version_version_created_at_idx" ON "_pastoral_visits_v" USING btree ("version_created_at");
  CREATE INDEX "_pastoral_visits_v_version_version__status_idx" ON "_pastoral_visits_v" USING btree ("version__status");
  CREATE INDEX "_pastoral_visits_v_created_at_idx" ON "_pastoral_visits_v" USING btree ("created_at");
  CREATE INDEX "_pastoral_visits_v_updated_at_idx" ON "_pastoral_visits_v" USING btree ("updated_at");
  CREATE INDEX "_pastoral_visits_v_latest_idx" ON "_pastoral_visits_v" USING btree ("latest");
  CREATE INDEX "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
  CREATE INDEX "gallery_images_updated_at_idx" ON "gallery_images" USING btree ("updated_at");
  CREATE INDEX "gallery_images_created_at_idx" ON "gallery_images" USING btree ("created_at");
  CREATE INDEX "biography_sections_updated_at_idx" ON "biography_sections" USING btree ("updated_at");
  CREATE INDEX "biography_sections_created_at_idx" ON "biography_sections" USING btree ("created_at");
  CREATE INDEX "biography_sections__status_idx" ON "biography_sections" USING btree ("_status");
  CREATE INDEX "_biography_sections_v_parent_idx" ON "_biography_sections_v" USING btree ("parent_id");
  CREATE INDEX "_biography_sections_v_version_version_updated_at_idx" ON "_biography_sections_v" USING btree ("version_updated_at");
  CREATE INDEX "_biography_sections_v_version_version_created_at_idx" ON "_biography_sections_v" USING btree ("version_created_at");
  CREATE INDEX "_biography_sections_v_version_version__status_idx" ON "_biography_sections_v" USING btree ("version__status");
  CREATE INDEX "_biography_sections_v_created_at_idx" ON "_biography_sections_v" USING btree ("created_at");
  CREATE INDEX "_biography_sections_v_updated_at_idx" ON "_biography_sections_v" USING btree ("updated_at");
  CREATE INDEX "_biography_sections_v_latest_idx" ON "_biography_sections_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_diary_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("diary_entries_id");
  CREATE INDEX "payload_locked_documents_rels_pastoral_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("pastoral_visits_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_images_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_images_id");
  CREATE INDEX "payload_locked_documents_rels_biography_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("biography_sections_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "programme_upcoming_order_idx" ON "programme_upcoming" USING btree ("_order");
  CREATE INDEX "programme_upcoming_parent_id_idx" ON "programme_upcoming" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "diary_entries" CASCADE;
  DROP TABLE "_diary_entries_v" CASCADE;
  DROP TABLE "pastoral_visits_images" CASCADE;
  DROP TABLE "pastoral_visits" CASCADE;
  DROP TABLE "_pastoral_visits_v_version_images" CASCADE;
  DROP TABLE "_pastoral_visits_v" CASCADE;
  DROP TABLE "gallery_images" CASCADE;
  DROP TABLE "biography_sections" CASCADE;
  DROP TABLE "_biography_sections_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "programme_upcoming" CASCADE;
  DROP TABLE "programme" CASCADE;
  DROP TYPE "public"."enum_diary_entries_status";
  DROP TYPE "public"."enum__diary_entries_v_version_status";
  DROP TYPE "public"."enum_pastoral_visits_status";
  DROP TYPE "public"."enum__pastoral_visits_v_version_status";
  DROP TYPE "public"."enum_gallery_images_category";
  DROP TYPE "public"."enum_biography_sections_status";
  DROP TYPE "public"."enum__biography_sections_v_version_status";`)
}
