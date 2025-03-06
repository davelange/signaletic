<script lang="ts">
  import { useDialog } from '$components/dialog/index.svelte';
  import { colors, toHsl } from '$lib/utils';
  import DisplayEditor from './DisplayEditor.svelte';
  import DisplayOptions from './DisplayOptions.svelte';
  import { getPlannerState } from './planner.svelte';

  const planner = getPlannerState();
  const dialog = useDialog();
</script>

<div class="mb-4 flex gap-4">
  {#each planner.allDisplays as display}
    {@const color = colors[display.id % colors.length]}
    {@const selected = planner.selectedDisplayIds.includes(display.id)}

    <button
      class="text-dark/80 rounded-xl px-3 py-1 text-xs"
      style:background={toHsl(color.light, selected ? 1 : 0.2)}
      onclick={() => {
        dialog.open({
          title: 'Edit display',
          description: '',
          content: DisplayOptions,
          contentProps: {
            display
          }
        });
      }}
    >
      {display.name}
    </button>
  {/each}
  <button
    class="text-dark/80 rounded-xl bg-slate-100 px-3 py-1 text-xs hover:bg-slate-300"
    type="button"
    onclick={() => {
      dialog.open({
        title: 'Add display',
        description: '',
        content: DisplayEditor,
        contentProps: {}
      });
    }}
  >
    Add new display
  </button>
</div>
