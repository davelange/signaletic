import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getProjectBySlug, getTemplates } from '$db/lib';

export const load: LayoutServerLoad = async ({ params }) => {
  const project = await getProjectBySlug(params.slug);
  const templates = await getTemplates();

  if (!project || !templates) {
    error(404, 'Project not found');
  }

  return { project, templates };
};
