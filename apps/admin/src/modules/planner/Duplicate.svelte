<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { DatePicker } from '$components/date-picker';
  import { useDialog } from '$components/dialog/index.svelte';
  import { TimePicker } from '$components/time-picker';
  import type { DisplayScene } from '$db/entities';
  import { displaySceneRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import {
    fromDate,
    getLocalTimeZone,
    type DateValue
  } from '@internationalized/date';
  import { timeFromInput, timeToDate, toTimeInput } from '$lib/utils';
  import { Popover } from 'bits-ui';

  let { baseScene }: { baseScene: DisplayScene } = $props();
  let scene = $state(baseScene);
  let popoverOpen = $state(false);
  const dialog = useDialog();

  let baseDate = new Date(scene.startsAt);
  let startsAtInput = $state(toTimeInput(scene.startsAt));
  let endsAtInput = $state(toTimeInput(scene.endsAt));

  $effect(() => {
    startsAtInput = toTimeInput(scene.startsAt);
    endsAtInput = toTimeInput(scene.endsAt);
  });

  function handleBaseDateChange(date: DateValue) {
    const base = date.toDate(getLocalTimeZone());

    baseDate = timeToDate(timeFromInput(startsAtInput), base);
  }

  let duplicateMutation = useMutation({
    fn: (scene: DisplayScene) => {
      const { id, ...rest } = scene;

      return displaySceneRepo.insert({
        ...rest,
        name: `${rest.name} (2)`,
        startsAt: timeToDate(timeFromInput(startsAtInput), baseDate),
        endsAt: timeToDate(timeFromInput(endsAtInput), baseDate)
      });
    },
    onSuccess: async () => {
      await invalidateAll();
      dialog.close();
    }
  });
</script>

<Popover.Root open={popoverOpen} onOpenChange={(val) => (popoverOpen = val)}>
  <Popover.Trigger>
    <Button variant="secondary" type="button">Duplicate</Button>
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      class="border-dark-10 shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-full max-w-[500px] rounded-[12px] border bg-slate-50 p-4"
      sideOffset={8}
    >
      <div class="flex flex-col gap-2">
        <DatePicker
          defaultValue={fromDate(scene.startsAt, getLocalTimeZone())}
          onValueChange={(val) => handleBaseDateChange(val)}
        />
        <TimePicker
          label="From"
          name="startsAtInput"
          bind:value={startsAtInput}
        />
        <TimePicker label="To" name="endsAtInput" bind:value={endsAtInput} />
        <Button
          type="button"
          onclick={() => duplicateMutation.mutate(scene)}
          isLoading={duplicateMutation.isPending}
        >
          Add
        </Button>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
