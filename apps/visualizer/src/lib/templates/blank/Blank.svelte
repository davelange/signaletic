<script lang="ts">
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte';
	import { onMount } from 'svelte';

	let { template }: { template: BaseTemplate } = $props();

	onMount(() => {
		template.loadGUI();
	});

	$inspect(template);
</script>

<div class="wrapper">
	<p>{template.parameters?.textInput}</p>
</div>

<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		background: lightblue;
	}
</style>
