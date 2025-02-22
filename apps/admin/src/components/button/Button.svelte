<script lang="ts">
  import { Button } from 'bits-ui';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonVariants, type Size, type Variant } from './index';
  import clsx from 'clsx';

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
  class={clsx(buttonVariants({ variant, size, fullWidth }), className)}
  {...props}
>
  {@render children?.()}
</Button.Root>
