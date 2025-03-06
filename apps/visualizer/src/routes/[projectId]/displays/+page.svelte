<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

Projects

{#each data.project.displays as display}
	<a href="/{data.project.id}/displays/{display.id}">
		{display.name}
	</a>
{/each}
