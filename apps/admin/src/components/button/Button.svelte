<script lang="ts">
  import { Button } from 'bits-ui';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonVariants, type Size, type Variant } from './index';
  import clsx from 'clsx';
  import type { ComponentProps } from 'svelte';

  let {
    variant = 'default',
    size = 'default',
    class: className,
    fullWidth,
    children,
    isLoading,
    ...props
  }: ComponentProps<typeof Button.Root> & {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    isLoading?: boolean;
    className?: HTMLButtonAttributes['class'];
  } = $props();
</script>

<Button.Root
  class={clsx(buttonVariants({ variant, size, fullWidth }), className)}
  {...props}
>
  {#if isLoading}
    <LoaderCircle class="mr-1 size-4 animate-spin" />
  {/if}
  {@render children?.()}
</Button.Root>
