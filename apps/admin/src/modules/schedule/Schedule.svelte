<script lang="ts">
  import type { scheduleEvent } from '$db/src/schema';
  import type { InferSelectModel } from 'drizzle-orm';
  import DayWrapper from '$components/DayWrapper.svelte';
  import AddDay from '$components/AddDay.svelte';
  import EventList from './EventList.svelte';
  import { getEventDays } from '$lib/utils';

  type Props = {
    events: InferSelectModel<typeof scheduleEvent>[];
    projectId: string;
  };

  let { events, projectId }: Props = $props();

  let eventDays = $state(getEventDays(events));
</script>

<div class="flex gap-8">
  {#each eventDays as day}
    <DayWrapper {day}>
      <EventList {projectId} {events} {day} />
    </DayWrapper>
  {/each}
  <AddDay
    onSubmit={(value) => {
      eventDays.push(value);
    }}
  />
</div>
