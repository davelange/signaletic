<script lang="ts">
  import { Button } from '$components/button';
  import { elementImages } from '$lib/utils';
  import { Popover } from 'bits-ui';
  import type { DisplaySceneElement } from '../../app';

  let { elements = $bindable() }: { elements: DisplaySceneElement[] } =
    $props();

  function handleAdd(src: string) {
    elements.push({
      src,
      width: 15,
      height: 15,
      x: elements.length * 5,
      y: elements.length * 5
    });
  }
</script>

<Popover.Root>
  <Popover.Trigger
    class="rounded-input bg-dark
      text-background shadow-mini hover:bg-dark/95 active:scale-98 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-medium transition-all hover:cursor-pointer"
  >
    <Button variant="secondary" type="button">Add element</Button>
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      class="border-dark-10 bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-full max-w-[500px] rounded-[12px] border p-4"
      sideOffset={8}
    >
      <div class="flex flex-wrap gap-4">
        {#each elementImages as src}
          <button type="button" onclick={() => handleAdd(src)}>
            <img
              {src}
              alt="Available"
              class="w-[100px] border border-slate-300 p-4"
            />
          </button>
        {/each}
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
