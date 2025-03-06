import { Allow, BackendMethod, Entity, Fields, repo, Validators } from "remult";
import { Relations } from "remult";
import { Display } from "./Display.js";
import { ScheduleEvent } from "./ScheduleEvent.js";

@Entity<Project>("projects", {
  allowApiCrud: true,
  defaultOrderBy: { name: "asc" },
  saved(entity, e) {
    if (e.isNew) {
      entity.initializeDisplays(entity.id);
    }
  },
})
export class Project {
  constructor() {
    this.scheduleEvents = [];
    this.displays = [];
  }

  @BackendMethod({ allowed: Allow.authenticated })
  async initializeDisplays(projectId: number) {
    const defaultDisplay = await repo(Display).insert({
      projectId,
      name: "TV #1",
    });
    this.displays = [defaultDisplay];
  }

  @Fields.integer()
  id!: number;

  @Fields.string({ allowNull: true })
  name?: string;

  @Fields.string({ validate: [Validators.unique], allowNull: true })
  slug!: string;

  // Relations toMany
  @Relations.toMany(() => Display)
  displays: Display[];

  @Relations.toMany(() => ScheduleEvent)
  scheduleEvents: ScheduleEvent[];
}
