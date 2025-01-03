ALTER TABLE "scenes" RENAME TO "displayScenes";--> statement-breakpoint
ALTER TABLE "displayScenes" DROP CONSTRAINT "scenes_displayId_displays_id_fk";
--> statement-breakpoint
ALTER TABLE "displayScenes" DROP CONSTRAINT "scenes_scheduleEventId_scheduleEvents_id_fk";
--> statement-breakpoint
ALTER TABLE "displays" ADD COLUMN "name" varchar;--> statement-breakpoint
ALTER TABLE "displayScenes" ADD CONSTRAINT "displayScenes_displayId_displays_id_fk" FOREIGN KEY ("displayId") REFERENCES "public"."displays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "displayScenes" ADD CONSTRAINT "displayScenes_scheduleEventId_scheduleEvents_id_fk" FOREIGN KEY ("scheduleEventId") REFERENCES "public"."scheduleEvents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "displayScenes" DROP COLUMN "duration";