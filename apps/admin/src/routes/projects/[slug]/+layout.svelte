<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import DaysWrapper from '$modules/planner/DaysWrapper.svelte';
  import { getEventDays, dateToCalendarDate } from '$lib/utils';

  let { data: project, children }: { data: PageData; children: Snippet } =
    $props();

  $inspect(project);

  const allDisplayScenes = $derived(
    project.displays.flatMap((d) => d.displayScenes)
  );

  const dates = $derived(
    getEventDays(allDisplayScenes).map(dateToCalendarDate)
  );
</script>

<p style="margin-bottom: 2rem;">{project.name}</p>

<DaysWrapper {dates} {allDisplayScenes} projectId={project.id} />

{@render children()}
