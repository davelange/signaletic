<script>
  import Layout from '$components/Layout.svelte';
  import '../app.css';

  let { children } = $props();
</script>

<Layout>
  {@render children()}
</Layout>
