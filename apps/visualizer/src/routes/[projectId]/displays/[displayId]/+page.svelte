<script lang="ts">
	import { page } from '$app/state';
	import { Display } from '$db/entities/Display.js';
	import type { DisplayScene } from '$db/entities/DisplayScene.js';
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte.js';
	import { repo } from 'remult';
	import { onMount, type Component } from 'svelte';

	let baseDate = page.url.searchParams.get('baseDate'); // Date
	let displayId = page.params.displayId;

	let sceneList: DisplayScene[] = $state([]);
	let currentScene: DisplayScene | undefined = $state();

	async function getSceneList() {
		const data = await repo(Display).findId(Number(displayId), {
			include: {
				displayScenes: {
					orderBy: { startsAt: 'asc' },
					include: {
						template: true,
						templateConfig: true
					}
				}
			}
		});

		sceneList = data?.displayScenes || [];
	}

	function getCurrentScene() {
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
			(scene) =>
				scene.startsAt.getTime() <= date.getTime() && scene.endsAt.getTime() > date.getTime()
		);
	}

	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate(isDiff = false) {
		if (isDiff && currentScene) {
			template?.onStop?.();

			const module = await import(`$templates/${currentScene.template.name}/index.svelte.ts`);
			template = module.load(currentScene.templateConfig || null);

			if (template) {
				template.debug = false;
			}

			RenderedComponent = await template?.loadComponent();
		}

		scheduleRefetch();
	}

	function scheduleRefetch() {
		setTimeout(async () => {
			await getSceneList();
			const newScene = getCurrentScene();
			const isDiff = newScene?.id !== currentScene?.id;
			currentScene = newScene;

			loadTemplate(isDiff);
		}, 1000 * 60);
	}

	onMount(async () => {
		await getSceneList();
		currentScene = getCurrentScene();
		loadTemplate(true);
	});
</script>

{#key template}
	{#if template && RenderedComponent}
		<RenderedComponent {template} />
	{/if}
{/key}
