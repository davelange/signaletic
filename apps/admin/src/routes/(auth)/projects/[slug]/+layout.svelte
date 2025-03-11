<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import DaysWrapper from '$modules/planner/DaysWrapper.svelte';
  import DisplaysList from '$modules/planner/DisplaysList.svelte';
  import { setPlannerState } from '$modules/planner/planner.svelte';
  import ProjectHeader from '$modules/project/ProjectHeader.svelte';
  import EventDatePicker from '$modules/project/EventDatePicker.svelte';
  import AddElement from '$modules/planner/AddElement.svelte';

  let { data, children }: { data: PageData; children: Snippet } = $props();

  const planner = setPlannerState({ data: data.project });

  $effect(() => {
    planner.data = data.project;
  });
</script>

<div class="col-span-3 flex flex-col gap-4">
  <ProjectHeader />
  <DisplaysList />
  <AddElement />
  {#if !planner.dates.length}
    <EventDatePicker />
  {:else}
    <DaysWrapper />
  {/if}
  {@render children()}
</div>
