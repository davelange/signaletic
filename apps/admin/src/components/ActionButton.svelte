<script lang="ts" generics="C extends 'button' | 'a' = 'button'">
  import type { ComponentProps, Snippet } from 'svelte';
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes
  } from 'svelte/elements';
  import Button from './ui/button/button.svelte';

  type FormProps = {
    action: string;
    [key: string]: string | number | Date | null;
  };

  type Props = {
    children: Snippet;
    action?: FormProps;
    as?: C;
  } & ComponentProps<Button> &
    (C extends 'button' ? HTMLButtonAttributes : HTMLAnchorAttributes);

  let { children, as, action, ...props }: Props = $props();

  let formVals = $derived(
    Object.entries(action || {}).filter((entry) => entry[0] !== 'action')
  );
</script>

{#snippet button()}
  <Button {...props as unknown as HTMLButtonAttributes}>
    {@render children()}
  </Button>
{/snippet}

{#if action}
  <!-- Button in a form -->
  <form action={action.action} method="post">
    {#each formVals as [name, value] (name)}
      <input type="hidden" {name} {value} />
    {/each}
    <Button {...props as unknown as HTMLButtonAttributes} type="submit">
      {@render children()}
    </Button>
  </form>
{:else}
  <!-- Just a button -->
  {@render button()}
{/if}
