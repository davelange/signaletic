import { repo } from "remult";
import { Project } from "../entities/Project";
import { Template } from "../entities/Template";
import { DisplayScene } from "../entities/DisplayScene";
import { Display } from "../entities";

export async function getProjects() {
  return repo(Project).find();
}

export async function getProjectBySlug(slug: string) {
  return repo(Project).findOne({
    where: { slug },
    include: {
      scheduleEvents: {
        orderBy: { startsAt: "asc" },
      },
      displays: { include: { displayScenes: true } },
    },
  });
}

export async function getProjectById(id: number) {
  return repo(Project).findId(id, {
    include: {
      scheduleEvents: {
        orderBy: { startsAt: "asc" },
      },
      displays: { include: { displayScenes: true } },
    },
  });
}

export async function getDisplayById(id: number) {
  return repo(Display).findId(id, {
    include: {
      displayScenes: {
        orderBy: { startsAt: "asc" },
      },
    },
  });
}

export function getTemplates() {
  return repo(Template).find();
}

export const displaySceneRepo = repo(DisplayScene);
export const displayRepo = repo(Display);
