<script>
  import '../app.css';
  import Layout from '$components/Layout.svelte';
  import { initRemultSvelteReactivity } from '$lib/remult';

  let { children } = $props();

  initRemultSvelteReactivity();
</script>

<Layout>
  {@render children()}
</Layout>
