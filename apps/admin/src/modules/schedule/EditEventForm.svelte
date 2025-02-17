<script lang="ts">
  import FormField from '$components/ui/form-field/FormField.svelte';
  import Input from '$components/ui/input/input.svelte';
  import { TimePicker } from '$components/time-picker';
  import { useTimePicker } from '$components/time-picker/timePicker.svelte';
  import type { scheduleEvent } from '$db/src/schema';
  import type { InferSelectModel } from 'drizzle-orm';

  type Props = {
    baseDate: Date;
    event?: InferSelectModel<typeof scheduleEvent>;
  };

  let { baseDate, event }: Props = $props();

  let timePicker = useTimePicker({
    baseDate,
    defaultValue: event?.startsAt
  });
</script>

<FormField label="Description">
  <Input
    name="description"
    type="text"
    placeholder="New event"
    value={event?.description || ''}
  />
</FormField>
<FormField label="Starts at">
  <div>
    <TimePicker name="startsAtTime" bind:value={timePicker.inputValue} />
  </div>
</FormField>
<input name="startsAt" type="hidden" value={timePicker.dateValue} />
<input name="id" type="hidden" value={event?.id} />
<input name="projectId" value={event?.projectId} type="hidden" />
