ALTER TABLE "scenes" ADD COLUMN "displayId" integer;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_displayId_displays_id_fk" FOREIGN KEY ("displayId") REFERENCES "public"."displays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "displays" DROP COLUMN "scenes";