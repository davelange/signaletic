<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import DaysWrapper from '$modules/planner/DaysWrapper.svelte';
  import { getEventDays, dateToCalendarDate } from '$lib/utils';

  let { data, children }: { data: PageData; children: Snippet } = $props();

  const allDisplayScenes = $derived(
    data.project.displays.flatMap((d) => d.displayScenes)
  );

  const dates = $derived(
    getEventDays(allDisplayScenes).map(dateToCalendarDate)
  );
</script>

<p style="margin-bottom: 2rem;">{data.project.name}</p>

<DaysWrapper {dates} {allDisplayScenes} projectId={data.project.id} />

{@render children()}
