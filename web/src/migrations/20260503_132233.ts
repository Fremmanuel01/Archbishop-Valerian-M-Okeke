import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_appointment_slots_audience" AS ENUM('laity', 'clergy');
  CREATE TYPE "public"."enum_appointment_slots_status" AS ENUM('available', 'booked', 'blocked');
  CREATE TYPE "public"."enum_appointment_bookings_audience" AS ENUM('laity', 'clergy');
  CREATE TYPE "public"."enum_appointment_bookings_status" AS ENUM('confirmed', 'cancelled', 'completed', 'no-show');
  CREATE TABLE "appointment_slots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"audience" "enum_appointment_slots_audience" DEFAULT 'laity' NOT NULL,
  	"status" "enum_appointment_slots_status" DEFAULT 'available' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "appointment_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slot_id" integer NOT NULL,
  	"audience" "enum_appointment_bookings_audience" DEFAULT 'laity' NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"parish" varchar,
  	"reason" varchar NOT NULL,
  	"status" "enum_appointment_bookings_status" DEFAULT 'confirmed' NOT NULL,
  	"confirmation_code" varchar NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointment_slots_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointment_bookings_id" integer;
  ALTER TABLE "appointment_bookings" ADD CONSTRAINT "appointment_bookings_slot_id_appointment_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."appointment_slots"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "appointment_slots_updated_at_idx" ON "appointment_slots" USING btree ("updated_at");
  CREATE INDEX "appointment_slots_created_at_idx" ON "appointment_slots" USING btree ("created_at");
  CREATE INDEX "appointment_bookings_slot_idx" ON "appointment_bookings" USING btree ("slot_id");
  CREATE UNIQUE INDEX "appointment_bookings_confirmation_code_idx" ON "appointment_bookings" USING btree ("confirmation_code");
  CREATE INDEX "appointment_bookings_updated_at_idx" ON "appointment_bookings" USING btree ("updated_at");
  CREATE INDEX "appointment_bookings_created_at_idx" ON "appointment_bookings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointment_slots_fk" FOREIGN KEY ("appointment_slots_id") REFERENCES "public"."appointment_slots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointment_bookings_fk" FOREIGN KEY ("appointment_bookings_id") REFERENCES "public"."appointment_bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_appointment_slots_id_idx" ON "payload_locked_documents_rels" USING btree ("appointment_slots_id");
  CREATE INDEX "payload_locked_documents_rels_appointment_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("appointment_bookings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appointment_slots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "appointment_bookings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "appointment_slots" CASCADE;
  DROP TABLE "appointment_bookings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointment_slots_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointment_bookings_fk";
  
  DROP INDEX "payload_locked_documents_rels_appointment_slots_id_idx";
  DROP INDEX "payload_locked_documents_rels_appointment_bookings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointment_slots_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointment_bookings_id";
  DROP TYPE "public"."enum_appointment_slots_audience";
  DROP TYPE "public"."enum_appointment_slots_status";
  DROP TYPE "public"."enum_appointment_bookings_audience";
  DROP TYPE "public"."enum_appointment_bookings_status";`)
}
