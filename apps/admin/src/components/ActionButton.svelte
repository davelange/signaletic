<script lang="ts" generics="C extends 'button' | 'a' = 'button'">
  import type { ComponentProps, Snippet } from 'svelte';
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes
  } from 'svelte/elements';
  import Button from './ui/button/button.svelte';
  import { NiceForm } from '$lib/NiceForm.svelte';
  import { enhance } from '$app/forms';
  import Loading from 'lucide-svelte/icons/loader-circle';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { children, as, action, ...props }: Props = $props();

  let formVals = $derived(
    Object.entries(action || {}).filter((entry) => entry[0] !== 'action')
  );

  let form = new NiceForm({});
</script>

{#snippet button()}
  <Button {...props as unknown as HTMLButtonAttributes}>
    {@render children()}
  </Button>
{/snippet}

{#if action}
  <!-- Button in a form -->
  <form action={action.action} method="post" use:enhance={() => form.enhance()}>
    {#each formVals as [name, value] (name)}
      <input type="hidden" {name} {value} />
    {/each}
    <Button {...props as unknown as HTMLButtonAttributes} type="submit">
      {#if form.isLoading}
        <Loading size={14} class="mr-1 animate-spin" />
      {:else}
        {@render children()}
      {/if}
    </Button>
  </form>
{:else}
  <!-- Just a button -->
  {@render button()}
{/if}
