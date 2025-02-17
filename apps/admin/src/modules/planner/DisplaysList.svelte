<script lang="ts">
  import type { display } from '$db/src/schema';
  import { colors } from '$lib/utils';

  let {
    allDisplays,
    selectedDisplayIds = $bindable()
  }: {
    allDisplays: (typeof display.$inferSelect)[];
    selectedDisplayIds: number[];
  } = $props();
</script>

<div class="mb-4 flex gap-4">
  {#each allDisplays as display}
    {@const color = colors[display.id % colors.length]}
    {@const selected = selectedDisplayIds.includes(display.id)}

    <button
      class="text-dark/80 rounded-xl px-3 py-1 text-xs"
      style:background={selected ? color.light : 'transparent'}
      style:border="1px solid {color.default}"
      onclick={() => {
        if (selected) {
          selectedDisplayIds = selectedDisplayIds.filter(
            (id) => display.id !== id
          );
        } else {
          selectedDisplayIds.push(display.id);
        }
      }}
    >
      {display.name}
    </button>
  {/each}
</div>
