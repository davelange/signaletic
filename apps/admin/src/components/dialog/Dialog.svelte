<script lang="ts">
  import { useDialog } from './index.svelte';
  import { Dialog } from 'bits-ui';
  import XIcon from 'lucide-svelte/icons/x';

  let dialog = useDialog();
</script>

<Dialog.Root
  bind:open={dialog.isOpen}
  onOpenChange={(val) => {
    dialog.isOpen = val;
  }}
>
  <Dialog.Portal>
    <Dialog.Overlay class="bg-background/80 fixed inset-0 backdrop-blur-sm" />

    <Dialog.Content
      class="bg-background fixed left-[50%] top-[50%] z-50 grid w-fit min-w-[600px] max-w-[94%] translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:rounded-lg"
    >
      {#if dialog.options}
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <Dialog.Title
            class="text-lg font-semibold leading-none tracking-tight"
          >
            {dialog.options.title}
          </Dialog.Title>
          {#if dialog.options.description}
            <Dialog.Description class="text-muted-foreground text-sm">
              {dialog.options.description}
            </Dialog.Description>
          {/if}
        </div>
        <div class="flex flex-col items-start gap-1 pb-11 pt-7">
          <dialog.options.content {...dialog.options.contentProps} />
        </div>
      {/if}

      <Dialog.Close
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
      >
        <div>
          <XIcon class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </div>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
