import { getDisplayById } from '$db/lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const display = await getDisplayById(params.displayId);

  return { display };
};
