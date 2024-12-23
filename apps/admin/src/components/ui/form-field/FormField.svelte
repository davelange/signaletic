<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    label: string;
    children: Snippet;
  };

  let { label, children }: Props = $props();
</script>

<label class="flex gap-1 text-sm text-slate-500 flex-col">
  <p>{label}</p>
  {@render children()}
</label>
