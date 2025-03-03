<script lang="ts">
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import { CalendarDate } from '@internationalized/date';
  import { invert } from './timedrag.svelte';
  import { Button } from '$components/button';
  import DisplaySceneForm from './DisplaySceneForm.svelte';
  import { untrack } from 'svelte';
  import AddDisplayScene from './AddDisplayScene.svelte';
  import { useDialog } from '$components/dialog/index.svelte';
  import type { MouseEventHandler } from 'svelte/elements';
  import { colors, formatTime, toHsl } from '$lib/utils';
  import { getPlannerState } from './planner.svelte';
  import type { DisplayScene } from '$db/entities/DisplayScene';

  let {
    scenes,
    baseDate,
    color,
    displayId
  }: {
    scenes: DisplayScene[];
    baseDate: CalendarDate;
    color: (typeof colors)[number];
    displayId: number;
  } = $props();

  const planner = getPlannerState();
  const dialog = useDialog();

  let timeDrag = planner.addTimeDrag(scenes, baseDate, displayId);

  $effect(() => {
    timeDrag.updateScenes(scenes);

    untrack(() => {
      timeDrag.createBlocks();
    });
  });

  $effect(() => {
    timeDrag.updateTimeframe(planner.timeEdges);

    untrack(() => {
      timeDrag.createBlocks();
    });
  });
</script>

{#snippet dragHandle(onmousedown: MouseEventHandler<HTMLButtonElement>)}
  <button
    type="button"
    class="h-2 cursor-move opacity-50 hover:opacity-100"
    style:background={toHsl(color.default, 1.2)}
    {onmousedown}
    aria-label="Drag"
  ></button>
{/snippet}

<svelte:document onmouseup={() => timeDrag.handleDragEnd()} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="group relative h-full w-full overflow-hidden"
  onmousemove={(e) => timeDrag.handleMouseMove(e)}
  style="--bg-color: {toHsl(color.light, 0.7)}; --bg-color-alt: {toHsl(
    color.light,
    0.5
  )};"
>
  {#each timeDrag.blocks as block, idx}
    {@const scene = timeDrag.scene(idx)}
    <div
      class="absolute flex w-full flex-col justify-between bg-[var(--bg-color-alt)] hover:bg-[var(--bg-color)]"
      style:top="{block.top}%"
      style:bottom="{block.bottom}%"
    >
      {@render dragHandle(() => timeDrag.handleDragStart(idx, 'top'))}

      <div
        class="pointer-events-none absolute flex w-full flex-1 flex-col justify-between p-2"
      >
        <p class="text-sm">
          {formatTime(timeDrag.getTimeFromPos(block.top))}
        </p>
        <p class="text-sm font-semibold">{scene.name}</p>
        <p class="mt-auto text-sm">
          {formatTime(timeDrag.getTimeFromPos(invert(block.bottom)))}
        </p>

        <button
          type="button"
          class="pointer-events-auto absolute right-3 top-3"
          onclick={() => {
            dialog.open({
              title: `Edit scene (${scene.name})`,
              description: '',
              content: DisplaySceneForm,
              contentProps: {
                scene: $state.snapshot(scene)
              }
            });
          }}
        >
          <SettingsIcon opacity={0.7} size={16} />
        </button>
      </div>

      {@render dragHandle(() => timeDrag.handleDragStart(idx, 'bottom'))}
    </div>
  {/each}

  <Button
    type="button"
    variant="secondary"
    class="absolute bottom-2 left-2 right-2 z-10 m-auto hidden group-hover:block"
    size="sm"
    onclick={() => {
      dialog.open({
        title: 'Add scene',
        description: '',
        content: AddDisplayScene,
        contentProps: {
          baseDate: timeDrag.baseDate,
          displayId: timeDrag.displayId,
          startTime: timeDrag.timeEdges.start
        }
      });
    }}
  >
    Add scene
  </Button>
</div>
