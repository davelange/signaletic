<script lang="ts">
  import { colors, toHsl } from '$lib/utils';
  import { getPlannerState } from './planner.svelte';

  const planner = getPlannerState();
</script>

<div class="mb-4 flex gap-4">
  {#each planner.allDisplays as display}
    {@const color = colors[display.id % colors.length]}
    {@const selected = planner.selectedDisplayIds.includes(display.id)}

    <button
      class="text-dark/80 rounded-xl px-3 py-1 text-xs"
      style:background={toHsl(color.light, selected ? 1 : 0.2)}
      onclick={() => planner.toggleDisplay(display.id)}
    >
      {display.name}
    </button>
  {/each}
  <button
    class="text-dark/80 rounded-xl bg-slate-200 px-3 py-1 text-xs hover:bg-slate-300"
    type="button"
  >
    Edit displays
  </button>
</div>
