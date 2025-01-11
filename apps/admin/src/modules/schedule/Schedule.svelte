<script lang="ts">
  import type { scheduleEvent } from '$db/src/schema';
  import type { InferSelectModel } from 'drizzle-orm';
  import DayWrapper from './DayWrapper.svelte';
  import AddDay from './AddDay.svelte';
  import EventList from './EventList.svelte';

  type Props = {
    events: InferSelectModel<typeof scheduleEvent>[];
    projectId: string;
  };

  let { events, projectId }: Props = $props();

  function getEventDays() {
    return events
      .map((item) => {
        let d = new Date(item.startsAt);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime();
      })
      .filter((item, idx, arr) => arr.indexOf(item) === idx)
      .map((a) => new Date(a));
  }

  let eventDays = $state(getEventDays());
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
