import { deleteProjectBySlug, getProjectBySlug } from '$db/lib';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return getProjectBySlug(params.id);
};

export const actions: Actions = {
	deleteProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (id !== undefined) {
			await deleteProjectBySlug(id);

			return redirect(303, '/');
		}
	}
};
