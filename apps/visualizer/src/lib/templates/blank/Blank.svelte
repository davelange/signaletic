<script lang="ts">
	import { onMount } from 'svelte';

	let { template } = $props();
	/* let config = $state(
		props.config || {
			textInput: 'hello world'
		}
	); */

	onMount(() => {
		template.loadGUI();
	});
</script>

<div class="wrapper">
	<p>{template.config?.textInput}</p>
</div>

<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		background: lightblue;
	}
</style>
