import type { DisplayScene } from '$db/entities';

export function isDifferentScene(
	newScene: DisplayScene | undefined,
	current: DisplayScene | undefined
) {
	if (!newScene && !current) return false;
	if (!newScene && current) return false;
	if (newScene && !current) return true;

	if (newScene!.id !== current!.id) return true;

	if (newScene!.templateId !== current!.templateId) return true;

	return JSON.stringify(newScene!.templateConfig) !== JSON.stringify(current!.templateConfig);
}

export function getCurrentScene(sceneList: DisplayScene[], baseDate: string | null) {
	const date = baseDate ? new Date(baseDate) : null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!date || isNaN(date as any)) {
		return sceneList.find(
			(scene) => scene.startsAt.getTime() <= Date.now() && scene.endsAt.getTime() > Date.now()
		);
	}

	const now = new Date();
	date.setHours(now.getHours());
	date.setMinutes(now.getMinutes());
	date.setSeconds(now.getSeconds());

	return sceneList.find(
		(scene) => scene.startsAt.getTime() <= date.getTime() && scene.endsAt.getTime() > date.getTime()
	);
}
