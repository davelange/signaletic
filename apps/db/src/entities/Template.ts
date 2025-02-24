import { Entity, Fields } from "remult"
import { Relations } from "remult"
import { DisplayScene } from "./DisplayScene.js"
import { Preset } from "./Preset.js"

@Entity<Template>("templates", {
  allowApiCrud: true,
  defaultOrderBy: { name: "asc" },
})
export class Template {
  @Fields.integer()
  id!: number

  @Fields.json({ allowNull: true })
  config? = {}

  @Fields.string({ allowNull: true })
  name?: string

  // Relations toMany
  @Relations.toMany(() => DisplayScene)
  displayScenes?: DisplayScene[]

  @Relations.toMany(() => Preset)
  presets?: Preset[]
}
