<script lang="ts">
  import type { displayScene } from '$db/src/schema';
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import { CalendarDate, Time } from '@internationalized/date';
  import { TimeDrag } from './timedrag.svelte';
  import { Button } from '$components/ui/button';
  import DisplaySceneForm from './DisplaySceneForm.svelte';
  import { untrack } from 'svelte';
  import AddDisplayScene from './AddDisplayScene.svelte';

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
</script>

<svelte:document onmouseup={() => timeDrag.handleDragEnd()} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wrapper" onmousemove={(e) => timeDrag.handleMouseMove(e)}>
  {#each timeDrag.blocks as block, idx}
    {@const form = { bind: undefined }}
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

      <Button
        variant="ghost"
        onclick={() => {
          form.bind?.toggleDialog();
        }}
      >
        <SettingsIcon size={16} />
      </Button>

      <DisplaySceneForm {scene} {projectId} bind:sceneDialogForm={form.bind} />
      <button
        type="button"
        class="drag-area"
        onmousedown={() => timeDrag.handleDragStart(idx, 'bottom')}
        aria-label="Drag"
      ></button>
    </div>
  {/each}

  <!-- <button onclick={() => console.log($state.snapshot(timeDrag.blocks))}
    >State</button
  > -->

  <AddDisplayScene
    {projectId}
    baseDate={timeDrag.baseDate}
    displayId={timeDrag.displayId}
    startTime={timeDrag.timeEdges[0]}
  />
</div>

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
