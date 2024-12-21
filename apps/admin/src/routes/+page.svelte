<script lang="ts">
	let { data } = $props();
</script>

<h1>The dashboard</h1>
<a href="/projects/new">New project</a>

{#each data.projects as project}
	<div>
		<h2>{project.name}</h2>
		<a href="/projects/{project.slug}">Edit</a>
	</div>
{/each}
