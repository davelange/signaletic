<script>
  import Dialog from './dialog/Dialog.svelte';
  import { initDialog } from './dialog/index.svelte';

  let { children } = $props();

  initDialog();
</script>

<div class="container">
  {@render children()}
</div>
<Dialog />

<style>
  .container {
    width: 90%;
    height: 100%;
    max-width: 1200px;
    margin: 1rem auto;
    padding: var(--spacing-4) var(--spacing-8);
    border-radius: var(--spacing-1);
  }
</style>
