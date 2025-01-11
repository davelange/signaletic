import { relations, sql, SQL } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

// Project

export const project = pg.pgTable("projects", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: pg.varchar(),
  slug: pg.varchar().unique(),
});

export const projectRelations = relations(project, (type) => ({
  scheduleEvents: type.many(scheduleEvent),
  displays: type.many(display),
}));

// Schedule Event

export const scheduleEvent = pg.pgTable("scheduleEvents", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: pg
    .integer()
    .references(() => project.id)
    .notNull(),

  startsAt: pg.timestamp().notNull(),
  description: pg.text(),
});

export const scheduleEventRelations = relations(scheduleEvent, (type) => ({
  project: type.one(project, {
    fields: [scheduleEvent.projectId],
    references: [project.id],
  }),
}));

//Display

export const display = pg.pgTable("displays", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: pg
    .integer()
    .references(() => project.id)
    .notNull(),
  name: pg.varchar(),
});

export const displayRelations = relations(display, (type) => ({
  project: type.one(project, {
    fields: [display.projectId],
    references: [project.id],
  }),
  displayScenes: type.many(displayScene),
}));

// Display Scene

export const displayScene = pg.pgTable("displayScenes", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  displayId: pg.integer().references(() => display.id),
  scheduleEventId: pg.integer().references(() => scheduleEvent.id),
  startsAt: pg.timestamp().notNull(),
});

export const displaySceneRelations = relations(displayScene, (type) => ({
  display: type.one(display, {
    fields: [displayScene.displayId],
    references: [display.id],
  }),
  scheduleEvent: type.one(scheduleEvent, {
    fields: [displayScene.scheduleEventId],
    references: [scheduleEvent.id],
  }),
}));
