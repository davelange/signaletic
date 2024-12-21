import type { PageServerLoad } from './$types';
import { getAllProjects } from '$db/lib';

export const load: PageServerLoad = async () => {
	const projects = await getAllProjects();

	return {
		projects
	};
};
