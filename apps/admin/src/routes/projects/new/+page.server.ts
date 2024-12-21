import { createNewProject } from '$db/lib';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const slug = data.get('slug') as string;

		const insert = await createNewProject({ name, slug });

		if (insert?.id) {
			return redirect(303, '/');
		}
	}
};
