<script lang="ts">
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone
  } from '@internationalized/date';
  import { cn } from '$lib/utils.js';
  import { Button } from '$components/ui/button';
  import { Calendar } from '$components/ui/calendar';
  import * as Popover from '$components/ui/popover';

  export let name: string = '';
  export let onChange: (val: DateValue | undefined) => void;

  let value: DateValue | undefined = undefined;

  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });
</script>

<Popover.Root openFocus>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="outline"
      class={cn(
        'w-[180px] justify-start text-left font-normal',
        !value && 'text-muted-foreground'
      )}
      builders={[builder]}
      size="sm"
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {value ? df.format(value.toDate(getLocalTimeZone())) : 'Select a date'}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value initialFocus onValueChange={onChange} />
  </Popover.Content>
  <input type="hidden" bind:value {name} />
</Popover.Root>
