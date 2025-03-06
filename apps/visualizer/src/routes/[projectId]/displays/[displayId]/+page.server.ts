import { getDisplayById } from '$db/lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const display = await getDisplayById(Number(params.displayId));

	return {
		scenes: display?.displayScenes || []
	};
};
