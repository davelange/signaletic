import { Entity, Fields, Validators } from "remult"
import { Relations } from "remult"
import { Display } from "./Display.js"
import { ScheduleEvent } from "./ScheduleEvent.js"

@Entity<Project>("projects", {
  allowApiCrud: true,
  defaultOrderBy: { name: "asc" },
})
export class Project {
  @Fields.integer()
  id!: number

  @Fields.string({ allowNull: true })
  name?: string

  @Fields.string({ validate: [Validators.unique], allowNull: true })
  slug?: string

  // Relations toMany
  @Relations.toMany(() => Display)
  displays?: Display[]

  @Relations.toMany(() => ScheduleEvent)
  scheduleEvents?: ScheduleEvent[]
}
