<script lang="ts">
	const { data } = $props();
</script>

Projects

{#each data.displays as display}
	<a href="/{data.projectId}/displays/{display.id}">
		{display.name}
	</a>
{/each}
