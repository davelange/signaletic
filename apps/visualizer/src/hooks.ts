import type { Transport } from '@sveltejs/kit';
import { remultTransport } from '$lib/remult';

export const transport: Transport = {
	// encode and decode remult data
	remultTransport
};
