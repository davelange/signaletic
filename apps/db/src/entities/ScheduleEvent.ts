import { Entity, Field, Fields } from "remult"
import { Relations } from "remult"
import { DisplayScene } from "./DisplayScene.js"
import { Project } from "./Project.js"

@Entity<ScheduleEvent>("scheduleEvents", {
  allowApiCrud: true,
})
export class ScheduleEvent {
  @Fields.integer()
  id!: number

  @Fields.integer()
  projectId!: number

  @Relations.toOne(() => Project, { field: "projectId" })
  project!: Project

  @Fields.date()
  startsAt!: Date

  @Fields.string({ allowNull: true })
  description?: string

  // Relations toMany
  @Relations.toMany(() => DisplayScene)
  displayScenes?: DisplayScene[]
}
