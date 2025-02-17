import { getTemplateById } from '$db/lib';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const template = await getTemplateById(params.templateId);

	if (!template) {
		error(404);
	}

	console.log(template);

	return { template };
};
