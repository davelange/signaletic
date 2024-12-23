<script lang="ts">
	let { data } = $props();
</script>

<h2 class="title">Projects</h2>

<div class="project-list">
	{#each data.projects as project (project.id)}
		<a class="card" href="/projects/{project.slug}">
			<p>{project.name}</p>
		</a>
	{/each}
</div>

<a href="/projects/new" class="add-new">Add new project</a>

<style>
	.title {
		font-size: 2rem;
		margin-bottom: var(--spacing-4);
	}
	.project-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		margin-bottom: var(--spacing-4);
	}
</style>
