import { getProjectById } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const project = await getProjectById(Number(params.projectId));

	if (!project) {
		error(404);
	}

	return { project };
};
