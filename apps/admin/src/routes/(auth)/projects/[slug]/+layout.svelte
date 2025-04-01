<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import DaysWrapper from '$modules/planner/DaysWrapper.svelte';
  import DisplaysList from '$modules/planner/DisplaysList.svelte';
  import { setPlannerState } from '$modules/planner/planner.svelte';
  import ProjectHeader from '$modules/project/ProjectHeader.svelte';
  import EventDatePicker from '$modules/project/EventDatePicker.svelte';
  import * as Tabs from '$components/tabs';
  import LiveSceneWrapper from '$modules/live/LiveSceneWrapper.svelte';

  let { data, children }: { data: PageData; children: Snippet } = $props();

  const planner = setPlannerState({ data: data.project });

  $effect(() => {
    planner.data = data.project;
  });
</script>

<div class="col-span-3 flex flex-col gap-4">
  <Tabs.Root value="schedule" class="w-[700px]">
    <div class="mb-6 flex gap-5">
      <Tabs.List>
        <p class="pl-2 pr-4 text-lg font-semibold">{data.project.name}</p>
        <Tabs.Trigger value="schedule">Schedule</Tabs.Trigger>
        <Tabs.Trigger value="live-scenes">Live scenes</Tabs.Trigger>

        <ProjectHeader />
      </Tabs.List>
    </div>
    <Tabs.Content value="schedule">
      <div class="col-span-3 flex flex-col gap-4">
        <DisplaysList />
        {#if !planner.dates.length}
          <EventDatePicker />
        {:else}
          <DaysWrapper />
        {/if}
      </div>
    </Tabs.Content>
    <Tabs.Content value="live-scenes">
      <LiveSceneWrapper project={data.project} />
    </Tabs.Content>
  </Tabs.Root>

  {@render children()}
</div>
