<script lang="ts">
	import Input from '$components/Input.svelte';
</script>

<div>
	<h1>Add new project</h1>

	<form method="post">
		<!-- <label for="name">Name</label>
		<input type="text" id="name" name="name" /> -->
		<Input type="text" id="name" name="name" label="Name" />
		<button type="submit">Create</button>
	</form>
</div>
