import { Entity, Field, Fields } from "remult";
import { Relations } from "remult";
import { DisplayScene } from "./DisplayScene.js";
import { Project } from "./Project.js";

@Entity<Display>("displays", {
  allowApiCrud: true,
  defaultOrderBy: { name: "asc" },
})
export class Display {
  constructor() {
    this.displayScenes = [];
  }

  @Fields.integer()
  id!: number;

  @Fields.integer()
  projectId!: number;

  @Relations.toOne(() => Project, { field: "projectId" })
  project!: Project;

  @Fields.string({ allowNull: true })
  name?: string;

  // Relations toMany
  @Relations.toMany(() => DisplayScene)
  displayScenes: DisplayScene[];
}
