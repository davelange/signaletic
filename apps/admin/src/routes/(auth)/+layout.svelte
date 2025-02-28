<script>
  import Layout from '$components/Layout.svelte';
  import { initRemult } from '$lib/remult';

  import { initPlanner } from '$modules/planner/planner.svelte';
  import { signOut } from '@auth/sveltekit/client';

  let { children } = $props();

  initPlanner();
  initRemult();
</script>

<Layout>
  <button onclick={() => signOut()}>Sign out</button>
  {@render children()}
</Layout>
