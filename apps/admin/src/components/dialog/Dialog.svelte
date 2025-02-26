<script lang="ts">
  import { useDialog } from './index.svelte';
  import { Dialog, Separator } from 'bits-ui';
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
    <Dialog.Overlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/80"
    />
    <Dialog.Content
      class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50  w-fit  min-w-[400px] max-w-[94%] translate-x-[-50%] translate-y-[-50%] border p-5 outline-none"
    >
      {#if dialog.options}
        <Dialog.Title
          class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
        >
          {dialog.options.title}
        </Dialog.Title>
        <Separator.Root class="bg-muted -mx-5 mb-6 mt-5 block h-px" />
        <Dialog.Description class="text-foreground-alt text-sm">
          {dialog.options.description}
        </Dialog.Description>
        <div class="flex flex-col items-start gap-1 pb-11 pt-7">
          <dialog.options.content {...dialog.options.contentProps} />
        </div>
      {/if}

      <Dialog.Close
        class="focus-visible:ring-foreground focus-visible:ring-offset-background active:scale-98 absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <div>
          <XIcon />
          <span class="sr-only">Close</span>
        </div>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
