import {
  createDisplay,
  createScheduleEvent,
  deleteProjectBySlug,
  deleteScheduledEvent,
  editScheduleEvent
} from '$db/lib';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { InferInsertModel } from 'drizzle-orm';
import type { display, scheduleEvent } from '$db/src/schema';

function getFormValues<T>(formData: FormData) {
  const values: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value as string;
  }

  return values as T;
}

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
  }
};
