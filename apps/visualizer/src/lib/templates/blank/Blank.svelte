<script lang="ts">
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte';
	import { onMount } from 'svelte';

	let { template }: { template: BaseTemplate } = $props();

	onMount(() => {
		template.loadGUI();
	});
</script>

<div class="wrapper">
	<p>{template.parameters?.textInput}</p>
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
