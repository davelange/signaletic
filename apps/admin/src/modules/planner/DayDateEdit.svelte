<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone
  } from '@internationalized/date';
  import { Popover } from 'bits-ui';
  import { Calendar } from '$components/calendar';
  import { getPlannerState } from './planner.svelte';

  let { date }: { date: CalendarDate } = $props();

  const planner = getPlannerState();

  const df = new DateFormatter('en-GB', {
    dateStyle: 'short'
  });

  let value = $state<DateValue | undefined>(date);

  function handleChange(val?: DateValue) {
    if (!val) return;

    Object.values(planner.timeDrags)
      .filter((item) => item.baseDate.compare(date) === 0)
      .map((dragger) => {
        dragger.updateSceneBaseDate(val as CalendarDate);
      });
    planner.updateDay(date, val as CalendarDate);
  }
</script>

<Popover.Root>
  <Popover.Trigger class="flex w-full items-center justify-center gap-2">
    <span>{df.format(date.toDate(getLocalTimeZone()))}</span>
    <CalendarIcon class="mr-2 size-3" />
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      class="bg-background relative mt-2 w-auto rounded-md border p-0"
    >
      <Calendar type="single" bind:value onValueChange={handleChange} />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
