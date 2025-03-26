<script lang="ts">
	import { page } from '$app/state';
	import type { DisplayScene } from '$db/entities';
	import { displaySceneRepo } from '$db/lib';
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte';
	import type { PageData } from './$types';
	import { onMount, type Component } from 'svelte';

	let { data }: { data: PageData } = $props();

	let displaySceneId = page.url.searchParams.get('displaySceneId') || '';

	let templateData = $derived(data.template);
	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate(sceneToLoad?: DisplayScene) {
		if (!templateData) return;

		const module = await import(`$templates/${templateData.name}/index.svelte.ts`);
		template = module.load(sceneToLoad?.templateConfig || null, []);
		RenderedComponent = await template?.loadComponent();
	}

	onMount(async () => {
		let sceneData = await displaySceneRepo.findId(Number(displaySceneId));
		await loadTemplate(sceneData || undefined);
	});
</script>

{#if RenderedComponent}
	<RenderedComponent config={{}} {template} />
{/if}
