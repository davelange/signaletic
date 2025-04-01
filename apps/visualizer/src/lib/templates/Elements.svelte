<script>
	let { elements = [] } = $props();
</script>

<div class="element-wrapper">
	{#each elements as element}
		<div
			style:width="{element.width}%"
			style:height="{element.height}%"
			style:top="{element.y}%"
			style:left="{element.x}%"
			class="element"
		>
			<img src={element.src} alt="" />
		</div>
	{/each}
</div>

<style>
	.element-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}

	.element-wrapper img {
		width: 100%;
	}
	.element {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
</style>
