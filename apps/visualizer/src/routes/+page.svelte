<script lang="ts">
	const { data } = $props();
</script>

Projects

{#each data.projects as project}
	<a href="/{project.id}/displays">
		{project.name}
	</a>
{/each}
