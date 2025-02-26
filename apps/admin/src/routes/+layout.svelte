<script>
  import '../app.css';
  import Layout from '$components/Layout.svelte';
  import { initRemult } from '$lib/remult';
  import { initDialog } from '$components/dialog/index.svelte';
  import { initPlanner } from '$modules/planner/planner.svelte';

  let { children } = $props();

  initPlanner();
  initRemult();
  initDialog();
</script>

<Layout>
  {@render children()}
</Layout>
