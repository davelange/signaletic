<script lang="ts">
  import type { displayScene } from '$db/src/schema';
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import { CalendarDate, Time } from '@internationalized/date';
  import { TimeDrag } from './timedrag.svelte';
  import { Button } from '$components/ui/button';
  import DisplaySceneForm from './DisplaySceneForm.svelte';
  import { untrack } from 'svelte';
  import AddDisplayScene from './AddDisplayScene.svelte';
  import { useDialog } from '$components/dialog/index.svelte';

  let {
    scenes,
    timeEdges,
    projectId,
    baseDate
  }: {
    scenes: (typeof displayScene.$inferSelect)[];
    timeEdges: Time[];
    projectId: number;
    baseDate: CalendarDate;
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

  const dialog = useDialog();
</script>

<svelte:document onmouseup={() => timeDrag.handleDragEnd()} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wrapper" onmousemove={(e) => timeDrag.handleMouseMove(e)}>
  {scenes.at(2)?.name}
  {#each timeDrag.blocks as block, idx}
    {@const scene = timeDrag.scene(idx)}
    <div
      class="scene-block"
      style:top="{block.top}%"
      style:bottom="{block.bottom}%"
    >
      <button
        type="button"
        class="drag-area"
        onmousedown={() => timeDrag.handleDragStart(idx, 'top')}
        aria-label="Drag"
      ></button>

      {scene.name}, Display {scene.name}

      {#snippet editDisplaySceneForm()}
        <DisplaySceneForm {scene} {projectId} />
      {/snippet}

      <Button
        variant="ghost"
        onclick={() => {
          dialog.open({
            title: `Edit scene (${scene.name})`,
            description: '',
            content: editDisplaySceneForm
          });
        }}
      >
        <SettingsIcon size={16} />
      </Button>

      <button
        type="button"
        class="drag-area"
        onmousedown={() => timeDrag.handleDragStart(idx, 'bottom')}
        aria-label="Drag"
      ></button>
    </div>
  {/each}

  <AddDisplayScene
    {projectId}
    baseDate={timeDrag.baseDate}
    displayId={timeDrag.displayId}
    startTime={timeDrag.timeEdges[0]}
  />
</div>

<dialog.Dialog {...dialog.props} />

<style>
  .wrapper {
    height: 100%;
  }
  .scene-block {
    position: absolute;
    width: 100%;
    background: #e65e6522;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .drag-area {
    cursor: move;
    background: #e65e6522;
    height: 0.5rem;
  }
</style>
