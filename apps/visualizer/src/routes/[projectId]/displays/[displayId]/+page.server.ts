import { getDisplayById } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const display = await getDisplayById(Number(params.displayId));

	if (!display) {
		error(404);
	}

	return {
		scenes: display.displayScenes
	};
};
