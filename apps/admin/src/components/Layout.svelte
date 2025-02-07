<script>
  let { children } = $props();
</script>

<div class="container">
  {@render children()}
</div>

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
