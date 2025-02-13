<script lang="ts">
	import type { PageData } from './$types';
	import { onMount, type Component } from 'svelte';
	import type { BlankTemplate } from '$templates/blank/index.svelte.js';

	let { data }: { data: PageData } = $props();

	let scene = $derived(data.scene);
	let template = $state<BlankTemplate>();
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
