import { asc, eq } from "drizzle-orm";
import { db } from "..";
import {
  display,
  displayScene,
  project,
  scheduleEvent,
  template,
} from "../schema";
import { DB } from "./types";

function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

export async function getAllProjects() {
  return await db.query.project.findMany();
}

export async function createNewProject(fields: DB.Project.Insert) {
  const insert = await db
    .insert(project)
    .values(fields)
    .returning({ id: project.id });

  return insert.at(0);
}

export async function getProjectBySlug(slug: string) {
  return db.query.project.findFirst({
    where: eq(project.slug, slug),
    with: {
      scheduleEvents: {
        orderBy: asc(scheduleEvent.startsAt),
      },
      displays: {
        with: {
          displayScenes: true,
        },
      },
    },
  });
}

export async function getTemplates() {
  return db.query.template.findMany();
}

export async function deleteProjectBySlug(slug: string) {
  return db.delete(project).where(eq(project.slug, slug));
}

export async function createScheduleEvent(fields: DB.ScheduleEvent.Insert) {
  const insert = await db.insert(scheduleEvent).values(fields).returning();

  return insert.at(0);
}

export async function deleteScheduledEvent(id: number) {
  return db.delete(scheduleEvent).where(eq(scheduleEvent.id, id));
}

export async function editScheduleEvent(
  id: number,
  params: DB.ScheduleEvent.Select
) {
  return db
    .update(scheduleEvent)
    .set(omit(params, "id"))
    .where(eq(scheduleEvent.id, id));
}

export async function createDisplay(fields: DB.Display.Insert) {
  return db.insert(display).values(fields).returning();
}

export async function deleteDisplay(id: number) {
  return db.delete(display).where(eq(display.id, id));
}

export async function getDisplays(projectId: string) {
  return db.query.display.findMany({
    where: eq(display.projectId, Number(projectId)),
  });
}

export async function getDisplayById(id: string) {
  return db.query.display.findFirst({
    where: eq(display.id, Number(id)),
    with: {
      displayScenes: {
        orderBy: asc(displayScene.startsAt),
        with: {
          scheduleEvent: true,
          template: true,
        },
      },
    },
  });
}

export async function createDisplayScene(fields: DB.DisplayScene.Insert) {
  return db.insert(displayScene).values(fields).returning();
}

export async function deleteDisplayScene(id: number) {
  return db.delete(displayScene).where(eq(displayScene.id, id));
}

export async function editDisplayScene(
  id: number,
  params: DB.DisplayScene.Select
) {
  return db
    .update(displayScene)
    .set(omit(params, "id"))
    .where(eq(displayScene.id, id));
}

export async function getDisplaySceneById(id: string) {
  return db.query.displayScene.findFirst({
    where: eq(displayScene.id, Number(id)),
    with: {
      template: true,
    },
  });
}

export async function getTemplateById(id: string) {
  return db.query.template.findFirst({
    where: eq(template.id, Number(id)),
  });
}

export * from "./types";
