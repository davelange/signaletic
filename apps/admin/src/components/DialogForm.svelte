<script lang="ts">
  import type { Snippet } from 'svelte';
  import { enhance } from '$app/forms';
  import * as Dialog from '$components/ui/dialog';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { Button } from './ui/button';
  import { NiceForm } from '$lib/NiceForm.svelte';
  import Loading from 'lucide-svelte/icons/loader-circle';

  type Props = {
    children: Snippet;
    altAction?: Snippet;
    title: string;
    submitButtonText: string;
    onSuccess?: () => void;
  } & HTMLFormAttributes;

  let {
    children,
    altAction,
    title,
    submitButtonText,
    onSuccess,
    ...props
  }: Props = $props();

  let isVisible = $state(false);

  let form = new NiceForm({
    onSuccess: () => {
      isVisible = false;
      onSuccess?.();
    }
  });

  export function toggleDialog() {
    isVisible = !isVisible;
  }
</script>

<Dialog.Root open={isVisible} onOpenChange={(val) => (isVisible = val)}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>

      <form use:enhance={() => form.enhance()} {...props}>
        {@render children()}

        <div class="flex justify-end gap-2">
          <div class="mr-auto">
            {@render altAction?.()}
          </div>
          <Button type="submit" class="order-2">
            {#if form.isLoading}
              <Loading size={14} class="mr-1 animate-spin" />
            {/if}
            {submitButtonText}
          </Button>
          <Button
            type="button"
            variant="outline"
            onclick={() => (isVisible = false)}
            class="order-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
