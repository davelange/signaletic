<script lang="ts">
  import { Select } from 'bits-ui';
  import CheckIcon from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
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
    value
      ? options.find((option) => option.value?.toString() === value?.toString())
          ?.label
      : 'Select an option'
  );
</script>

<div class="flex flex-col space-y-2">
  <input type="hidden" {name} bind:value />
  <Select.Root type="single" bind:value name={name || ''}>
    <p class="text-sm font-medium leading-none">{label}</p>
    <Select.Trigger
      class="h-input rounded-9px border-border-input bg-background placeholder:text-foreground-alt/50 inline-flex w-[296px] select-none items-center justify-between border px-[11px] text-sm transition-colors"
      aria-label="Select a theme"
    >
      {selectedLabel}
      <ChevronsUpDown opacity={0.3} />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-96 w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 outline-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
        sideOffset={10}
      >
        <Select.Viewport class="p-1">
          {#each options as option, i (i + option.value)}
            <Select.Item
              class="rounded-button data-[highlighted]:bg-muted flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize outline-none duration-75 data-[disabled]:opacity-50"
              value={option.value}
              label={option.label}
              disabled={option.disabled}
            >
              {#snippet children({ selected })}
                {option.label}
                {#if selected}
                  <div class="ml-auto">
                    <CheckIcon />
                  </div>
                {/if}
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
