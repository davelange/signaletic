<script lang="ts">
  import type { displayScene } from '$db/src/schema';
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import { CalendarDate, Time } from '@internationalized/date';
  import { TimeDrag } from './timedrag.svelte';
  import { Button } from '$components/button';
  import DisplaySceneForm from './DisplaySceneForm.svelte';
  import { untrack } from 'svelte';
  import AddDisplayScene from './AddDisplayScene.svelte';
  import { useDialog } from '$components/dialog/index.svelte';
  import type { MouseEventHandler } from 'svelte/elements';
  import { colors } from '$lib/utils';

  let {
    scenes,
    timeEdges,
    projectId,
    baseDate,
    color
  }: {
    scenes: (typeof displayScene.$inferSelect)[];
    timeEdges: Time[];
    projectId: number;
    baseDate: CalendarDate;
    color: (typeof colors)[number];
  } = $props();

  let timeDrag = new TimeDrag({ scenes, timeEdges, baseDate });

  $effect(() => {
    timeDrag.updateScenes(scenes);

    untrack(() => {
      timeDrag.createBlocks();
    });
  });

  $effect(() => {
    timeDrag.updateTimeframe(timeEdges);

    untrack(() => {
      timeDrag.createBlocks();
    });
  });

  const dialog = useDialog('editDisplayScene');
  const addSceneDialog = useDialog('addDisplayScene');
</script>

{#snippet dragHandle(onmousedown: MouseEventHandler<HTMLButtonElement>)}
  <button
    type="button"
    class="h-2 cursor-move opacity-50 hover:opacity-100"
    style:background={color.default}
    {onmousedown}
    aria-label="Drag"
  ></button>
{/snippet}

<svelte:document onmouseup={() => timeDrag.handleDragEnd()} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="group relative h-full w-full overflow-hidden"
  onmousemove={(e) => timeDrag.handleMouseMove(e)}
>
  {#each timeDrag.blocks as block, idx}
    {@const scene = timeDrag.scene(idx)}
    <div
      class="absolute flex w-full flex-col justify-between"
      style:background={color.light}
      style:top="{block.top}%"
      style:bottom="{block.bottom}%"
    >
      {@render dragHandle(() => timeDrag.handleDragStart(idx, 'top'))}

      <div class="relative flex-1 p-2">
        <p class="text-sm">{scene.name}</p>

        {#snippet editDisplaySceneForm()}
          <DisplaySceneForm {scene} {projectId} />
        {/snippet}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="absolute right-2 top-2"
          onclick={() => {
            dialog.open({
              title: `Edit scene (${scene.name})`,
              description: '',
              content: editDisplaySceneForm
            });
          }}
        >
          <SettingsIcon opacity={0.7} size={16} />
        </Button>
      </div>

      {@render dragHandle(() => timeDrag.handleDragStart(idx, 'bottom'))}
    </div>
  {/each}

  {#snippet addDisplaySceneForm()}
    <AddDisplayScene
      {projectId}
      baseDate={timeDrag.baseDate}
      displayId={timeDrag.displayId}
      startTime={timeDrag.timeEdges[0]}
    />
  {/snippet}

  <Button
    type="button"
    variant="secondary"
    class="absolute bottom-2 left-2 right-2 z-10 m-auto hidden group-hover:block"
    size="sm"
    onclick={() => {
      addSceneDialog.open({
        title: 'Add scene',
        description: '',
        content: addDisplaySceneForm
      });
    }}
  >
    Add scene
  </Button>
</div>

<dialog.Dialog {...dialog.props} />
<addSceneDialog.Dialog {...addSceneDialog.props} />
