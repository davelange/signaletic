<script>
  import { Button } from '$components/button';
  import { LayoutBase } from '$components/layout';
  import SignOutIcon from 'lucide-svelte/icons/log-out';
  import SignpostIcon from 'lucide-svelte/icons/signpost';
  import ListIcon from 'lucide-svelte/icons/list';
  import { signOut } from '@auth/sveltekit/client';
  import { Tooltip, TooltipProvider } from '$components/tooltip';

  let { children } = $props();
</script>

{#snippet sidebar()}
  <SignpostIcon class="size-5 text-indigo-700" />

  <Tooltip content="All projects" asLink>
    {#snippet trigger({ props })}
      <Button variant="ghost" {...props} href="/">
        <ListIcon class="text-muted-foreground size-4" />
      </Button>
    {/snippet}
  </Tooltip>

  <Tooltip content="Sign out">
    {#snippet trigger({ props })}
      <Button
        variant="ghost"
        class="mt-auto"
        {...props}
        onclick={() => signOut()}
      >
        <SignOutIcon class="size-4" />
      </Button>
    {/snippet}
  </Tooltip>
{/snippet}

<TooltipProvider.Provider>
  <LayoutBase {sidebar}>
    {@render children()}
  </LayoutBase>
</TooltipProvider.Provider>
