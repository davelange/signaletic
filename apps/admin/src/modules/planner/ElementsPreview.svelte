<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import DeleteIcon from '@lucide/svelte/icons/trash';
  import type { DisplayScene } from '$db/entities';

  let { elements = $bindable() }: { elements: DisplayScene['elements'] } =
    $props();

  let dragging: number = $state(-1);
  let resizing = $state({
    handle: '',
    index: -1,
    initialX: 0,
    initialY: 0,
    initialWidth: 0,
    initialHeight: 0
  });
  let localDragOffset = $state({ x: 0, y: 0 });
  let wrapper = $state() as HTMLDivElement;

  function toRelativePosition(
    evt: MouseEvent,
    offset?: { x: number; y: number }
  ) {
    const y =
      evt.clientY - wrapper.getBoundingClientRect().top - (offset?.y || 0);
    const x =
      evt.clientX - wrapper.getBoundingClientRect().left - (offset?.x || 0);

    return {
      x: (x * 100) / wrapper.offsetWidth,
      y: (y * 100) / wrapper.offsetHeight
    };
  }

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (evt) => {
    const idx = evt.currentTarget.getAttribute('data-idx');
    localDragOffset = { x: evt.offsetX, y: evt.offsetY };
    dragging = Number(idx);
    evt.stopImmediatePropagation();
  };

  const handleMouseMove = (evt: MouseEvent) => {
    if (dragging !== -1) {
      const { x, y } = toRelativePosition(evt, localDragOffset);
      elements[dragging].x = x;
      elements[dragging].y = y;

      evt.stopImmediatePropagation();
    } else if (resizing.index !== -1) {
      const { x, y } = toRelativePosition(evt);
      const diffX = x - resizing.initialX;
      const diffY = y - resizing.initialY;
      const element = elements[resizing.index];

      switch (resizing.handle) {
        case 'se':
          // Southeast: just adjust width and height
          element.width = resizing.initialWidth + diffX;
          element.height = resizing.initialHeight + diffY;
          break;
        case 'sw':
          // Southwest: adjust x, width (inversely) and height
          element.x = resizing.initialX + diffX;
          element.width = resizing.initialWidth - diffX;
          element.height = resizing.initialHeight + diffY;
          break;
        case 'ne':
          // Northeast: adjust height and width
          element.width = resizing.initialWidth + diffX;
          element.y = resizing.initialY + diffY;
          element.height = resizing.initialHeight - diffY;
          break;
        case 'nw':
          // Northwest: adjust x, y, width (inversely), and height (inversely)
          element.x = resizing.initialX + diffX;
          element.y = resizing.initialY + diffY;
          element.width = resizing.initialWidth - diffX;
          element.height = resizing.initialHeight - diffY;
          break;
      }

      evt.stopImmediatePropagation();
    }
  };

  const handleMouseUp = () => {
    dragging = -1;
    resizing.index = -1;
  };

  const handleResizeDown: MouseEventHandler<HTMLButtonElement> = (evt) => {
    const index = Number(evt.currentTarget.getAttribute('data-idx'));
    const handle = evt.currentTarget.getAttribute('data-handle') as string;
    const { x, y } = toRelativePosition(evt);

    resizing = {
      index,
      handle,
      initialX: x,
      initialY: y,
      initialWidth: elements[index].width,
      initialHeight: elements[index].height
    };

    evt.stopImmediatePropagation();
  };

  const handleRemove: MouseEventHandler<HTMLButtonElement> = (evt) => {
    const idx = Number(evt.currentTarget.getAttribute('data-idx'));
    elements = elements.filter((_, i) => i !== idx);
    evt.stopImmediatePropagation();
  };
</script>

<!-- <svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} /> -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="absolute h-full w-full"
  bind:this={wrapper}
  style:pointer-events={resizing.index !== -1 ? 'all' : 'none'}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
>
  {#each elements as element, idx}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      style:width="{element.width}%"
      style:height="{element.height}%"
      style:top="{element.y}%"
      style:left="{element.x}%"
      class="pointer-events-auto absolute flex items-center justify-center border-2 border-dashed border-slate-400"
      data-idx={idx}
      onmousedown={handleMouseDown}
    >
      <img
        src={element.src}
        alt=""
        class="pointer pointer-events-none w-full select-none"
      />

      <button
        type="button"
        data-idx={idx}
        onmousedown={handleRemove}
        class="z-60 pointer-events-auto absolute right-5 top-0 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white"
        aria-label="remove element"
      >
        <DeleteIcon class="text-destructive size-3" />
      </button>

      <!-- Northwest corner -->
      <button
        type="button"
        data-idx={idx}
        data-handle="nw"
        onmousedown={handleResizeDown}
        class="z-60 pointer-events-auto absolute left-0 top-0 size-3 -translate-x-[6px] -translate-y-[6px] cursor-nw-resize rounded-full bg-slate-400"
        aria-label="resize"
      >
      </button>

      <!-- Northeast corner -->
      <button
        type="button"
        data-idx={idx}
        data-handle="ne"
        onmousedown={handleResizeDown}
        class="z-60 pointer-events-auto absolute right-0 top-0 size-3 -translate-y-[6px] translate-x-[6px] cursor-ne-resize rounded-full bg-slate-400"
        aria-label="resize"
      >
      </button>

      <!-- Southeast corner -->
      <button
        type="button"
        data-idx={idx}
        data-handle="se"
        onmousedown={handleResizeDown}
        class="z-60 pointer-events-auto absolute bottom-0 right-0 size-3 translate-x-[6px] translate-y-[6px] cursor-se-resize rounded-full bg-slate-400"
        aria-label="resize"
      >
      </button>

      <!-- Southwest corner -->
      <button
        type="button"
        data-idx={idx}
        data-handle="sw"
        onmousedown={handleResizeDown}
        class="z-60 absolute bottom-0 left-0 size-3 -translate-x-[6px] translate-y-[6px] cursor-sw-resize rounded-full bg-slate-400"
        aria-label="resize"
      >
      </button>
    </div>
  {/each}
</div>
