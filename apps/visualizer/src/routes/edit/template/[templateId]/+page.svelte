<script lang="ts">
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte';
	import type { PageData } from './$types';
	import { onMount, type Component } from 'svelte';

	let { data }: { data: PageData } = $props();

	let templateData = $derived(data.template);
	let template = $state<BaseTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate() {
		if (!templateData) return;

		const module = await import(`$templates/${templateData.name}/index.svelte.ts`);
		template = module.load(null);
		RenderedComponent = await template?.loadComponent();
	}

	onMount(async () => {
		await loadTemplate();
	});
</script>

{#if RenderedComponent}
	<RenderedComponent config={{}} {template} />
{/if}
