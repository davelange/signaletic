<script lang="ts">
  import { Label, Select } from 'bits-ui';
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronsDown from '@lucide/svelte/icons/chevron-down';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  type Option = {
    label: string;
    value: string;
    disabled?: boolean;
  };

  let {
    options,
    value = $bindable(),
    label,
    name = ''
  }: { options: Option[]; label?: string } & HTMLSelectAttributes = $props();

  const selectedLabel = $derived(
    options.find((option) => option.value?.toString() === value?.toString())
      ?.label || 'Select an option'
  );

  $inspect({
    selectedLabel,
    options,
    value
  });
</script>

<div class="flex flex-col gap-1.5">
  <input type="hidden" {name} bind:value />
  <Select.Root type="single" bind:value name={name || ''}>
    {#if label}
      <Label.Root
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label.Root>
    {/if}

    <Select.Trigger
      class="border-input bg-background ring-offset-background focus-visible:ring-ring aria-[invalid]:border-destructive data-[placeholder]:[&>span]:text-muted-foreground flex h-10 w-full min-w-40 items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      aria-label="Select a theme"
    >
      {selectedLabel}
      <ChevronsDown opacity={0.3} class="size-4" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="bg-popover text-popover-foreground relative z-50 min-w-[var(--bits-select-anchor-width)] max-w-sm overflow-hidden rounded-md border shadow-md outline-none"
        sideOffset={4}
      >
        <Select.Viewport>
          {#each options as option, i (i + option.value)}
            <Select.Item
              class="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              value={option.value}
              label={option.label}
              disabled={option.disabled}
            >
              {#snippet children({ selected })}
                {option.label}
                {#if selected}
                  <CheckIcon class="ml-2 size-4" />
                {/if}
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
