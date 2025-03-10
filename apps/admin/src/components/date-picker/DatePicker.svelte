<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone
  } from '@internationalized/date';
  import { Popover } from 'bits-ui';
  import { cn } from '$lib/ui-utils';
  import { buttonVariants } from '$components/button';
  import { Calendar } from '$components/calendar';

  let {
    onValueChange
  }: {
    onValueChange: (date: DateValue) => void;
  } = $props();

  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });

  let value = $state<DateValue | undefined>();
  let contentRef = $state<HTMLElement | null>(null);
</script>

<Popover.Root>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: 'outline',
        class: 'w-[280px] justify-start text-left font-normal'
      }),
      !value && 'text-muted-foreground'
    )}
  >
    <CalendarIcon class="mr-2 size-4" />
    {value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
  </Popover.Trigger>
  <Popover.Content
    bind:ref={contentRef}
    class="mt-2 w-auto rounded-md border p-0"
  >
    <Calendar type="single" bind:value onValueChange={onValueChange as never} />
  </Popover.Content>
</Popover.Root>
