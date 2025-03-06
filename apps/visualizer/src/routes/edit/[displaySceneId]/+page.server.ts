import { getDisplaySceneById } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const scene = await getDisplaySceneById(Number(params.displaySceneId));

	if (!scene) {
		error(404);
	}

	return { scene };
};
