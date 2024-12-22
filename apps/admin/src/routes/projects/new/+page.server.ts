import { createNewProject, getAllProjects } from '$db/lib';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const projects = await getAllProjects();

	return { projects };
};

function generateSlug(name: string) {
	const rand = Math.random().toString(36).substring(2, 15);
	return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${rand}`;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const insert = await createNewProject({ name, slug: generateSlug(name) });

		if (insert?.id) {
			return redirect(303, '/');
		}
	}
};
