import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getPresets, getProjectBySlug, getTemplates } from '$db/lib';

export const load: LayoutServerLoad = async ({ params }) => {
  const [project, templates, presets] = await Promise.all([
    await getProjectBySlug(params.slug),
    await getTemplates(),
    await getPresets()
  ]);

  if (!project || !templates) {
    error(404, 'Project not found');
  }

  return { project, templates, presets };
};
