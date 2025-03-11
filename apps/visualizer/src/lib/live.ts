import { page } from '$app/state';
import type { DisplayScene } from '$db/entities';
import Ably from 'ably';

const ably = new Ably.Realtime(import.meta.env.VITE_ABLY_KEY);

ably.connection.once('connected', () => {
	console.log('Connected to Ably!');
});

async function subscribe({ onNewScene }: { onNewScene: (scene: DisplayScene) => void }) {
	const channel = ably.channels.get(`${page.params.projectId}_${page.params.displayId}`);

	channel.subscribe('new_scene', ({ data }) => {
		console.log('new_scene');
		console.log(data);
		onNewScene(data);
	});
}

export { subscribe };
