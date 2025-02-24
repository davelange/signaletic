import type { LayoutServerLoad } from './$types';
import { getProjects } from '$db/lib';

export const load: LayoutServerLoad = async () => {
  const projects = await getProjects();

  return {
    projects
  };
};
