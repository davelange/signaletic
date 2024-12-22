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
});

export const scene = pg.pgTable("scenes", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  displayId: pg.integer().references(() => display.id),
  scheduleEventId: pg.integer().references(() => scheduleEvent.id),
  startsAt: pg.timestamp().notNull(),
  duration: pg.timestamp().notNull(),
});
