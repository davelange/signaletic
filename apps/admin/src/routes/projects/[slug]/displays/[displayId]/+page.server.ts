import { getDisplayById } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const display = await getDisplayById(params.displayId);

  if (!display) {
    throw error(404, 'Display not found');
  }

  console.log(display);

  display.displayScenes = display?.displayScenes || [];

  return { display };
};
