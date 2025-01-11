import { asc, eq, InferInsertModel } from "drizzle-orm";
import { db } from "../src";
import { display, project, scheduleEvent } from "../src/schema";

export async function getAllProjects() {
  return await db.query.project.findMany();
}

export async function createNewProject(
  fields: InferInsertModel<typeof project>
) {
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
      displays: true,
    },
  });
}

export async function deleteProjectBySlug(slug: string) {
  return db.delete(project).where(eq(project.slug, slug));
}

export async function createScheduleEvent(
  fields: InferInsertModel<typeof scheduleEvent>
) {
  const insert = await db.insert(scheduleEvent).values(fields).returning();

  return insert.at(0);
}

export async function deleteScheduledEvent(id: string) {
  return db.delete(scheduleEvent).where(eq(scheduleEvent.id, Number(id)));
}

export async function editScheduleEvent(
  id: string,
  params: Omit<InferInsertModel<typeof scheduleEvent>, "projectId">
) {
  return db
    .update(scheduleEvent)
    .set(params)
    .where(eq(scheduleEvent.id, Number(id)));
}

export async function createDisplay(fields: InferInsertModel<typeof display>) {
  return db.insert(display).values(fields).returning();
}

export async function getDisplayById(id: string) {
  return db.query.display.findFirst({
    where: eq(display.id, Number(id)),
  });
}
