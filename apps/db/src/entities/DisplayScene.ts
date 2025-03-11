import { Entity, Field, Fields } from "remult";
import { Relations } from "remult";
import { Display } from "./Display.js";
import { Template } from "./Template.js";
import { ScheduleEvent } from "./ScheduleEvent.js";

@Entity<DisplayScene>("displayScenes", {
  allowApiCrud: true,
  defaultOrderBy: { name: "asc" },
})
export class DisplayScene {
  @Fields.integer()
  id!: number;

  @Fields.string({ allowNull: true })
  name?: string;

  @Fields.integer()
  displayId!: number;

  @Relations.toOne(() => Display, { field: "displayId" })
  display!: Display;

  @Fields.integer()
  templateId!: number;

  @Relations.toOne(() => Template, { field: "templateId" })
  template!: Template;

  @Fields.integer({ allowNull: true })
  scheduleEventId?: number;

  @Relations.toOne(() => ScheduleEvent, { field: "scheduleEventId" })
  scheduleEvent?: ScheduleEvent;

  @Fields.date()
  startsAt!: Date;

  @Fields.date()
  endsAt!: Date;

  @Fields.json({ allowNull: true })
  templateConfig? = {};

  @Fields.json({ allowNull: true })
  elements? = {};
}
