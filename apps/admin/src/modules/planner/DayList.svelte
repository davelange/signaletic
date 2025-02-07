<script lang="ts">
  import type { displayScene } from '$db/src/schema';
  import { Time } from '@internationalized/date';
  import { TimeDrag } from './timedrag.svelte';

  let {
    scenes,
    timeEdges
  }: {
    scenes: (typeof displayScene.$inferSelect)[];
    timeEdges: Time[];
  } = $props();

  let timeDrag = new TimeDrag(scenes, timeEdges);

  $effect(() => {
    timeDrag.updateTimeframe(timeEdges);
  });
</script>

<svelte:document onmouseup={() => timeDrag.handleDragEnd()} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wrapper" onmousemove={(e) => timeDrag.handleMouseMove(e)}>
  {#each timeDrag.blocks as block, idx}
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

      {block.scene.name}, Display {block.scene.name}

      <button
        type="button"
        class="drag-area"
        onmousedown={() => timeDrag.handleDragStart(idx, 'bottom')}
        aria-label="Drag"
      ></button>
    </div>
  {/each}

  <button onclick={() => console.log($state.snapshot(timeDrag.scenes))}
    >State</button
  >
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
