import { getProjectBySlug } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    error(404, 'Project not found');
  }

  return project;
};
