/* import {
  batchUpdateDisplayScenes,
  createDisplay,
  createDisplayScene,
  createScheduleEvent,
  deleteDisplay,
  deleteDisplayScene,
  deleteProjectBySlug,
  deleteScheduledEvent,
  editDisplayScene,
  editScheduleEvent,
  type DB
} from '$db/lib';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getFormValues } from '$lib/utils';
import { repo } from 'remult';
import { ScheduleEvent } from '../../../shared/entities/ScheduleEvent';

export const actions: Actions = {
  deleteProject: async ({ request }) => {
    const formData = await request.formData();
    const { id } = getFormValues<{ id: string }>(formData);

    if (id !== undefined) {
      await deleteProjectBySlug(id);
      return redirect(303, '/');
    }
  },

  addEvent: async ({ request }) => {
    const data = await request.json();

    const event = await repo(ScheduleEvent).insert(data);

    const formData = await request.formData();
    const data = getFormValues<DB.ScheduleEvent.Insert>(formData);

    const event = await createScheduleEvent(data);

    if (event) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to create event' });
  },

  deleteEvent: async ({ request }) => {
    const formData = await request.formData();
    const { id } = getFormValues<{ id: number }>(formData);

    const event = await deleteScheduledEvent(id);

    if (event) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to delete event' });
  },

  editEvent: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<DB.ScheduleEvent.Select>(formData);

    const event = await editScheduleEvent(data.id, data);

    if (event) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to edit event' });
  },

  addDisplay: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<DB.Display.Insert>(formData);

    const createdDisplay = await createDisplay(data);

    if (createdDisplay) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to create display' });
  },

  deleteDisplay: async ({ request, params }) => {
    const formData = await request.formData();
    const { displayId } = getFormValues<{ displayId: number }>(formData);

    const update = await deleteDisplay(displayId);

    if (update) {
      throw redirect(302, `/projects/${params.slug}`);
    }

    return fail(400, { error: 'Failed to delete display' });
  },

  addDisplayScene: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<DB.DisplayScene.Insert>(formData);

    const createdDisplay = await createDisplayScene(data);

    if (createdDisplay) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to create display scene' });
  },

  deleteDisplayScene: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<{ id: number }>(formData);

    const update = await deleteDisplayScene(data.id);

    if (update) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to delete scene' });
  },

  editDisplayScene: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<DB.DisplayScene.Select>(formData);

    const update = await editDisplayScene(data.id, data);

    if (update) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to edit diplay scene' });
  },

  batchUpdateDisplayScenes: async ({ request }) => {
    const reqJson = (await request.json()) as DB.DisplayScene.Select[];
    const data = reqJson.map((item) => ({
      ...item,
      startsAt: new Date(item.startsAt),
      endsAt: new Date(item.endsAt)
    }));

    const update = await batchUpdateDisplayScenes(data);

    if (update) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to edit diplay scene' });
  }
};
 */
