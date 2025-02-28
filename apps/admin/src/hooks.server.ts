import { api as remultApi } from '$db';
import { authHandle, authProvider } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(authProvider, authHandle, remultApi);
