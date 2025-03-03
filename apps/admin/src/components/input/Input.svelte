<script lang="ts">
  import { Label } from 'bits-ui';
  import type { HTMLInputAttributes } from 'svelte/elements';

  let {
    label,
    value = $bindable(),
    ...props
  }: HTMLInputAttributes & {
    label?: string;
  } = $props();
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
  {#if label}
    <Label.Root
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      for={`id_${props.name}`}
    >
      {label}
    </Label.Root>
  {/if}
  <input
    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
    id={props.id || `id_${props.name}`}
    bind:value
  />
</div>
