<script lang="ts">
	import Elements from '$templates/Elements.svelte';
	import { onMount } from 'svelte';
	import type { BlankTemplate } from './index.svelte';

	let { template }: { template: BlankTemplate } = $props();

	template.load = () => {
		template.loadGUI();
	};

	onMount(() => {
		template.load?.();
	});
</script>

<div class="wrapper">
	<p>{template.parameters?.textInput}</p>
	<Elements elements={template.elements} />
</div>

<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		background: black;
		display: flex;

		& p {
			color: #eee;
			margin: auto;
			font-family: sans-serif;
			font-size: 120px;
			text-align: center;
		}
	}
</style>
