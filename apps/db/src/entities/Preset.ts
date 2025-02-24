import { Entity, Field, Fields } from "remult"
import { Relations } from "remult"
import { Template } from "./Template.js"

@Entity<Preset>("presets", {
  allowApiCrud: true,
  defaultOrderBy: { name: "asc" },
})
export class Preset {
  @Fields.integer()
  id!: number

  @Fields.integer()
  templateId!: number

  @Relations.toOne(() => Template, { field: "templateId" })
  template!: Template

  @Fields.json({ allowNull: true })
  templateConfig? = {}

  @Fields.string({ allowNull: true })
  name?: string
}
