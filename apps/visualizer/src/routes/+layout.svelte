<script lang="ts">
	import { initRemult } from '$lib/remult';
	import '../app.css';

	let { children } = $props();

	initRemult();

	function toggleFullscreen() {
		const container = document.documentElement;
		if (!document.fullscreenElement) {
			container.requestFullscreen().catch((err) => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
		} else {
			document.exitFullscreen();
		}
	}
</script>

<div class="vis-wrapper">
	{@render children()}

	<button class="fullscreen-btn" onclick={() => toggleFullscreen()}> ⛶ </button>
</div>

<style>
	.vis-wrapper {
		background-color: #000;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	.fullscreen-btn {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background: none;
		border: 0;
		color: #fff;
	}
</style>
