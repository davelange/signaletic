import type { LayoutServerLoad } from './$types';
import { getAllProjects } from '$db/lib';

export const load: LayoutServerLoad = async () => {
  const projects = await getAllProjects();

  return {
    projects
  };
};
