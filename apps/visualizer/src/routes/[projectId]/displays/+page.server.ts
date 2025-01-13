import { getDisplays } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const displays = await getDisplays(params.projectId);

	if (!displays) {
		error(404);
	}

	return { displays, projectId: params.projectId };
};
