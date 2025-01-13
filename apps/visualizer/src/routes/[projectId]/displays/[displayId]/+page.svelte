<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import type { BlankTemplate } from '$templates/blank/index.js';

	let { data } = $props();

	let scene = $state(data.scenes?.[0]);
	let template = $state<BlankTemplate>();
	let RenderedComponent = $state<Component>();

	async function loadTemplate() {
		if (!scene) return;

		const module = await import(`$templates/${scene.template.config.name}/index.ts`);
		template = module.load(scene.template.config.config);
		RenderedComponent = await template?.loadComponent();
	}

	onMount(async () => {
		await loadTemplate();
		console.log(template?.config.textInput);
	});
</script>

{#if RenderedComponent}
	<RenderedComponent config={template?.config} text="hello" />
{/if}
