import { getTemplateById } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const template = await getTemplateById(Number(params.templateId));

	if (!template) {
		error(404);
	}

	return { template };
};
