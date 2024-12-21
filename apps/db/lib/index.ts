import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../src";
import { project } from "../src/schema";

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
  return db.query.project.findFirst({ where: eq(project.slug, slug) });
}

export async function deleteProjectBySlug(slug: string) {
  return db.delete(project).where(eq(project.slug, slug));
}
