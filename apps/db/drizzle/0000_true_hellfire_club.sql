CREATE TABLE "displays" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "displays_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"slug" varchar,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scenes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scenes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"displayId" integer,
	"scheduleEventId" integer,
	"startsAt" timestamp NOT NULL,
	"duration" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduleEvents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scheduleEvents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" integer NOT NULL,
	"startsAt" timestamp NOT NULL,
	"duration" timestamp NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "displays" ADD CONSTRAINT "displays_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_displayId_displays_id_fk" FOREIGN KEY ("displayId") REFERENCES "public"."displays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_scheduleEventId_scheduleEvents_id_fk" FOREIGN KEY ("scheduleEventId") REFERENCES "public"."scheduleEvents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduleEvents" ADD CONSTRAINT "scheduleEvents_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;