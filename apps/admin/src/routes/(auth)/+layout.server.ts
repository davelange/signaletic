import { getProjects } from '$db/lib';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const projects = await getProjects();

  return {
    projects
  };
};
