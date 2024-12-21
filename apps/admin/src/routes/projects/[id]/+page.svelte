<script lang="ts">
	let { data } = $props();
</script>

<h1>{data.name}</h1>

<form action="?/deleteProject" method="post">
	<input type="hidden" name="id" value={data.slug} />
	<button>Delete project</button>
</form>
