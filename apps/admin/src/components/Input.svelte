<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		label: string;
	};

	let { label, ...props }: HTMLInputAttributes & Props = $props();
</script>

<label class="container">
	<p>{label}</p>
	<input {...props} />
</label>

<style>
	.container {
		width: fit-content;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);

		& input {
			background-color: var(--zinc-700);
			border: 1px solid var(--zinc-50);
			padding: var(--spacing-1);
			color: var(--foreground-primary);
			border-radius: 2px;
		}
	}
</style>
