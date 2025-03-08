<script>
	import { initRemult } from '$lib/remult';
	import '../app.css';

	let { children } = $props();

	initRemult();
</script>

<div class="vis-wrapper">
	{@render children()}
</div>

<style>
	.vis-wrapper {
		background-color: #000;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}
</style>
