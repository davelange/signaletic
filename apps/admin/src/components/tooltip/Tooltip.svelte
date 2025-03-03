<script lang="ts" generics="T extends boolean = false">
  import { Tooltip } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes
  } from 'svelte/elements';

  let {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asLink,
    children,
    trigger,
    content
  }: {
    asLink?: T;
    trigger?: Snippet<
      [
        {
          props: T extends true
            ? HTMLAnchorAttributes & { type: undefined }
            : HTMLButtonAttributes;
        }
      ]
    >;
    children?: Snippet;
    content: string;
  } = $props();
</script>

<Tooltip.Root delayDuration={200}>
  {#if trigger}
    <Tooltip.Trigger child={trigger} />
  {:else}
    <Tooltip.Trigger>
      {@render children?.()}
    </Tooltip.Trigger>
  {/if}

  <Tooltip.Content sideOffset={8}>
    <div
      class="rounded-input border-dark-10 bg-background shadow-popover z-0 flex items-center justify-center border p-3 text-sm font-medium outline-none"
    >
      {content}
    </div>
  </Tooltip.Content>
</Tooltip.Root>
