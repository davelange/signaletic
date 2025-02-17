<script lang="ts">
  import { Button } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonVariants, type Size, type Variant } from './index';

  let {
    variant = 'default',
    size = 'default',
    class: className,
    fullWidth,
    children,
    ...props
  }: HTMLButtonAttributes & {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    className?: HTMLButtonAttributes['class'];
  } = $props();
</script>

<Button.Root
  class={cn(buttonVariants({ variant, size, fullWidth, className }))}
  {...props}
>
  {@render children?.()}
</Button.Root>
