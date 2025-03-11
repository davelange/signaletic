<script>
  import Dialog from '$components/dialog/Dialog.svelte';
  import { initDialog } from '$components/dialog/index.svelte';
  import { initRemult } from '$lib/remult';
  import { initPlanner } from '$modules/planner/planner.svelte';
  import '../app.css';

  let { children } = $props();

  initDialog();
  initPlanner();
  initRemult();
</script>

{@render children()}
<svelte:head>
  <title>Signaletic</title>
</svelte:head>
<Dialog />
