import { api as remultApi } from '$db';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(remultApi);
