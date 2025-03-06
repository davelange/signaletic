import { getProjects } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const projects = await getProjects();

	if (!projects) {
		return error(404);
	}

	return { projects };
};
