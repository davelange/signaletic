import {
  createDisplay,
  createDisplayScene,
  createScheduleEvent,
  deleteDisplay,
  deleteDisplayScene,
  deleteProjectBySlug,
  deleteScheduledEvent,
  editDisplayScene,
  editScheduleEvent
} from '$db/lib';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { InferInsertModel } from 'drizzle-orm';
import type { display, displayScene, scheduleEvent } from '$db/src/schema';
import { getFormValues } from '$lib/utils';

export const actions: Actions = {
  deleteProject: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id') as string;

    if (id !== undefined) {
      await deleteProjectBySlug(id);

      return redirect(303, '/');
    }
  },

  addEvent: async ({ request }) => {
    const formData = await request.formData();
    const data =
      getFormValues<InferInsertModel<typeof scheduleEvent>>(formData);

    const event = await createScheduleEvent({
      description: data.description,
      projectId: data.projectId,
      startsAt: new Date(Number(data.startsAt))
    });

    if (event) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to create event' });
  },

  deleteEvent: async ({ request }) => {
    const formData = await request.formData();
    const { id } = getFormValues<{ id: string }>(formData);

    const event = await deleteScheduledEvent(id);

    if (event) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to delete event' });
  },

  editEvent: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<
      InferInsertModel<typeof scheduleEvent> & { id: string }
    >(formData);

    const event = await editScheduleEvent(data.id, {
      description: data.description,
      startsAt: new Date(Number(data.startsAt))
    });

    if (event) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to edit event' });
  },

  addDisplay: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<InferInsertModel<typeof display>>(formData);

    const createdDisplay = await createDisplay({
      name: data.name,
      projectId: data.projectId
    });

    if (createdDisplay) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to create display' });
  },

  deleteDisplay: async ({ request, params }) => {
    const formData = await request.formData();
    const data = getFormValues<{ displayId: string }>(formData);

    const update = await deleteDisplay(data.displayId);

    if (update) {
      throw redirect(302, `/projects/${params.slug}`);
    }

    return fail(400, { error: 'Failed to delete display' });
  },

  addDisplayScene: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<typeof displayScene.$inferInsert>(formData);

    const createdDisplay = await createDisplayScene({
      displayId: data.displayId,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      scheduleEventId: data.scheduleEventId,
      name: data.name,
      templateId: 1
    });

    if (createdDisplay) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to create display scene' });
  },

  deleteDisplayScene: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<{ id: string }>(formData);

    const update = await deleteDisplayScene(data.id);

    if (update) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to delete scene' });
  },

  editDisplayScene: async ({ request }) => {
    const formData = await request.formData();
    const data = getFormValues<typeof displayScene.$inferSelect>(formData);

    console.log({
      displayId: Number(data.displayId),
      scheduleEventId: data.scheduleEventId
        ? Number(data.scheduleEventId)
        : undefined,
      name: data.name,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      templateId: data.templateId
    });

    const update = await editDisplayScene(data.id, {
      displayId: Number(data.displayId),
      scheduleEventId: data.scheduleEventId
        ? Number(data.scheduleEventId)
        : undefined,
      name: data.name,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      templateId: data.templateId
    });

    if (update) {
      return { success: true };
    }

    return fail(400, { error: 'Failed to edit diplay scene' });
  }
};
