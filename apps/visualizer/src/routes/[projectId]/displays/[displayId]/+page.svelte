<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte.js';
	import { onMount, type Component } from 'svelte';

	let { data } = $props();
	let baseDate = page.url.searchParams.get('baseDate'); // Date

	let currentScene = $derived.by(() => {
		const date = baseDate ? new Date(baseDate) : null;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (!date || isNaN(date as any)) {
			return data.scenes.find(
				(scene) => scene.startsAt.getTime() <= Date.now() && scene.endsAt.getTime() > Date.now()
			);
		}

		const now = new Date();
		date.setHours(now.getHours());
		date.setMinutes(now.getMinutes());
		date.setSeconds(now.getSeconds());

		return data.scenes.find(
			(scene) =>
				scene.startsAt.getTime() <= date.getTime() && scene.endsAt.getTime() > date.getTime()
		);
	});

	let prevTemplate = $state();

	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate() {
		if (currentScene) {
			const module = await import(`$templates/${currentScene.template.name}/index.svelte.ts`);
			template = module.load(currentScene.templateConfig || null);

			if (template) {
				template.debug = false;
			}

			RenderedComponent = await template?.loadComponent();

			if (prevTemplate && prevTemplate !== currentScene.templateId) {
				window.location.reload(); // Workaround
			}
			prevTemplate = currentScene.templateId;
		}

		scheduleRefetch();
	}

	function scheduleRefetch() {
		setTimeout(async () => {
			await invalidateAll();
			loadTemplate();
		}, 1000 * 60);
	}

	onMount(async () => {
		loadTemplate();
	});
</script>

{#if template && RenderedComponent}
	<RenderedComponent {template} />
{/if}
