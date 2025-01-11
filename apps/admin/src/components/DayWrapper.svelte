<script lang="ts">
  import type { Snippet } from 'svelte';

  let { day, children }: { day: Date; children: Snippet } = $props();
</script>

<div class="border-r border-slate-200 pr-8 min-h-[300px] min-w-[300px]">
  <h2 class="mb-4 font-bold">{day.toDateString()}</h2>

  {@render children()}
</div>
