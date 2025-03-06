<script>
	import { initRemult } from '$lib/remult';
	import '../app.css';

	let { children } = $props();

	initRemult();
</script>

{@render children()}
