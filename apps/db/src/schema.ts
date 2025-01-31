import { relations } from "drizzle-orm";
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
  name: pg.varchar(),
  displayId: pg
    .integer()
    .references(() => display.id)
    .notNull(),
  templateId: pg
    .integer()
    .references(() => template.id)
    .notNull(),
  scheduleEventId: pg.integer().references(() => scheduleEvent.id),
  startsAt: pg.timestamp().notNull(),
  endsAt: pg.timestamp().notNull(),
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
  template: type.one(template, {
    fields: [displayScene.templateId],
    references: [template.id],
  }),
}));

// Template

export const template = pg.pgTable("templates", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  config: pg.jsonb(),
  name: pg.varchar(),
});

export const templateRelations = relations(template, (type) => ({
  displayScenes: type.many(displayScene),
  presets: type.many(preset),
}));

// Preset

export const preset = pg.pgTable("presets", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  templateId: pg
    .integer()
    .references(() => template.id)
    .notNull(),
  templateConfig: pg.jsonb(),
  name: pg.varchar(),
});

export const presetRelations = relations(preset, (type) => ({
  template: type.one(template, {
    fields: [preset.templateId],
    references: [template.id],
  }),
}));
