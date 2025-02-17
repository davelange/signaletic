<script lang="ts">
  import { Label } from 'bits-ui';
  import type { HTMLInputAttributes } from 'svelte/elements';

  let {
    label,
    value = $bindable(),
    ...props
  }: HTMLInputAttributes & {
    label: string;
  } = $props();
</script>

<Label.Root
  class="flex flex-col space-y-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
>
  <p>
    {label}
  </p>
  <input
    class="h-input rounded-9px border-border-input bg-background placeholder:text-foreground-alt/50 focus:ring-foreground focus:ring-offset-background inline-flex w-full truncate border px-4 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
    {...props}
    bind:value
  />
</Label.Root>
