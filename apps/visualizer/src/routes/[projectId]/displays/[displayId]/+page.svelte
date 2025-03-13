<script lang="ts">
	import { page } from '$app/state';
	import { Display } from '$db/entities/Display.js';
	import type { DisplayScene } from '$db/entities/DisplayScene.js';
	import { subscribe } from '$lib/live';
	import { getCurrentScene, isDifferentScene } from '$lib/utils';
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

	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate(sceneToLoad?: DisplayScene) {
		if (!sceneToLoad || currentScene?.standalone) return;

		template?.stop?.();
		const module = await import(`$templates/${sceneToLoad.template.name}/index.svelte.ts`);
		template = module.load(sceneToLoad.templateConfig || null, sceneToLoad.elements);

		if (template) {
			template.debug = false;
		}

		RenderedComponent = await template?.loadComponent();
	}

	function scheduleRefetch() {
		setTimeout(async () => {
			await getSceneList();
			const newScene = getCurrentScene(sceneList, baseDate);
			const isDiff = isDifferentScene(newScene, currentScene);
			currentScene = newScene;

			if (isDiff) {
				loadTemplate(currentScene);
			}

			scheduleRefetch();
		}, 1000 * 60);
	}

	onMount(async () => {
		await getSceneList();
		currentScene = getCurrentScene(sceneList, baseDate);
		loadTemplate(currentScene);
		scheduleRefetch();
		subscribe({
			onNewScene: loadTemplate
		});
	});
</script>

{#key template}
	{#if template && RenderedComponent}
		<RenderedComponent {template} />
	{/if}
{/key}
