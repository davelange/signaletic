<script lang="ts">
  import type { displayScene } from '$db/src/schema';
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import { Time } from '@internationalized/date';
  import { TimeDrag } from './timedrag.svelte';
  import { Button } from '$components/ui/button';
  import DisplaySceneForm from './DisplaySceneForm.svelte';

  let {
    scenes,
    timeEdges,
    projectId
  }: {
    scenes: (typeof displayScene.$inferSelect)[];
    timeEdges: Time[];
    projectId: number;
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
    {@const form = { bind: undefined }}
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

      <Button
        variant="ghost"
        onclick={() => {
          console.log(block);
          form.bind?.toggleDialog();
        }}
      >
        <SettingsIcon size={16} />
      </Button>

      <DisplaySceneForm
        scene={block.scene}
        {projectId}
        bind:sceneDialogForm={form.bind}
      />
      <button
        type="button"
        class="drag-area"
        onmousedown={() => timeDrag.handleDragStart(idx, 'bottom')}
        aria-label="Drag"
      ></button>
    </div>
  {/each}

  <button onclick={() => console.log($state.snapshot(timeDrag.blocks))}
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
