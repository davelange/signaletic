<script lang="ts">
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte';
	import type { PageData } from './$types';
	import { onMount, type Component } from 'svelte';

	let { data }: { data: PageData } = $props();

	let scene = $derived(data.scene);
	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	$inspect(scene);

	async function loadTemplate() {
		if (!scene) return;

		const module = await import(`$templates/${scene.template.name}/index.svelte.ts`);
		template = module.load(scene.templateConfig || null);
		RenderedComponent = await template?.loadComponent();
	}

	onMount(async () => {
		await loadTemplate();
	});
</script>

{#if RenderedComponent}
	<RenderedComponent config={scene.templateConfig} {template} />
{/if}
