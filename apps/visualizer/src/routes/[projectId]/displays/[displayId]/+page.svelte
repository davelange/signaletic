<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte.js';
	import { onMount, type Component } from 'svelte';

	let { data } = $props();

	let currentScene = $derived(
		data.scenes.find(
			(scene) => scene.startsAt.getTime() <= Date.now() && scene.endsAt.getTime() > Date.now()
		)
	);
	let prevTemplate = $state();

	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate() {
		if (currentScene) {
			const module = await import(`$templates/${currentScene.template.name}/index.svelte.ts`);
			template = module.load(currentScene.templateConfig || null);
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
