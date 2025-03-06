<script lang="ts">
  import { DatePicker } from '$components/date-picker';
  import { getPlannerState } from '$modules/planner/planner.svelte';
  import { CalendarDate } from '@internationalized/date';

  const planner = getPlannerState();
</script>

<div class="m-auto my-[20vh] flex flex-col gap-4 text-center">
  <p class="font-semibold">What day does the event start?</p>
  <DatePicker
    onValueChange={(val) => {
      planner.dates = [new CalendarDate(val.year, val.month, val.day)];
    }}
  />
</div>
