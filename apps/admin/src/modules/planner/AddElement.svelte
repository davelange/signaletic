<script lang="ts">
  import { Button } from '$components/button';
  import { elementImages } from '$lib/media';
  import { Popover } from 'bits-ui';
  import type { DisplaySceneElement } from '../../app';
  import { Input } from '$components/input';

  let { elements = $bindable() }: { elements: DisplaySceneElement[] } =
    $props();

  let popoverOpen = $state(false);
  let newURL = $state('');

  function handleAdd(src: string) {
    elements.push({
      src,
      width: 15,
      height: 15,
      x: elements.length * 15,
      y: elements.length * 15
    });
    popoverOpen = false;
  }
</script>

<Popover.Root open={popoverOpen} onOpenChange={(val) => (popoverOpen = val)}>
  <Popover.Trigger>
    <Button variant="secondary" type="button">Add image element</Button>
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      class="border-dark-10 shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-full max-w-[500px] rounded-[12px] border bg-slate-800 p-4"
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
        <form
          class="flex gap-2"
          onsubmit={(e) => {
            e.preventDefault();
            handleAdd(newURL);
          }}
        >
          <Input placeholder="URL" bind:value={newURL} />
          <Button type="submit">Add</Button>
        </form>
        {#if newURL}
          <img
            onsubmit={() => handleAdd(newURL)}
            src={newURL}
            alt="New"
            class="w-[100px] border border-slate-300 p-4"
          />
        {/if}
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
