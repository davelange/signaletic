<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import DaysWrapper from '$modules/planner/DaysWrapper.svelte';
  import { getEventDays, dateToCalendarDate } from '$lib/utils';
  import DisplaysList from '$modules/planner/DisplaysList.svelte';

  let { data, children }: { data: PageData; children: Snippet } = $props();

  let allDisplays = $derived(data.project.displays);
  let selectedDisplayIds = $state(data.project.displays.map((item) => item.id));
  let selectedDisplays = $derived(
    data.project.displays.filter((item) => selectedDisplayIds.includes(item.id))
  );

  let allDisplayScenes = $derived(
    selectedDisplays.flatMap((d) => d.displayScenes)
  );
  let dates = $derived(getEventDays(allDisplayScenes).map(dateToCalendarDate));
</script>

<div class="flex flex-col gap-4">
  <p class="text-lg font-semibold">{data.project.name}</p>

  <DisplaysList {allDisplays} bind:selectedDisplayIds />

  <DaysWrapper
    {dates}
    {allDisplayScenes}
    {selectedDisplays}
    projectId={data.project.id}
  />

  {@render children()}
</div>
