import { getProjectBySlug } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const project = await getProjectBySlug(params.id);

  if (!project) {
    error(404, 'Project not found');
  }

  return project;
};
