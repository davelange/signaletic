<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import DaysWrapper from '$modules/planner/DaysWrapper.svelte';
  import DisplaysList from '$modules/planner/DisplaysList.svelte';
  import { setPlannerState } from '$modules/planner/planner.svelte';

  let { data, children }: { data: PageData; children: Snippet } = $props();

  const planner = setPlannerState({ data: data.project });

  $effect(() => {
    planner.data = data.project;
  });
</script>

<div class="col-span-3 flex flex-col gap-4">
  <p class="text-lg font-semibold">{data.project.name}</p>
  <DisplaysList />
  <DaysWrapper />
  {@render children()}
</div>
