<script lang="ts">
  import DialogForm from '$components/DialogForm.svelte';
  import { Input } from '$components/ui/input';
  import { Button } from '$components/ui/button';
  import {
    calendarDateToDate,
    timeFromInput,
    timeToDate,
    timeToInput
  } from '$lib/utils';
  import AddIcon from 'lucide-svelte/icons/circle-plus';
  import { TimePicker } from '$components/ui/time-picker';
  import type { CalendarDate, Time } from '@internationalized/date';

  let {
    projectId,
    displayId,
    baseDate,
    startTime
  }: {
    projectId: number;
    displayId?: number;
    baseDate: CalendarDate;
    startTime: Time;
  } = $props();

  let dialog: DialogForm | undefined = $state();

  let baseDateAsDate = calendarDateToDate(baseDate);
  let startsAtInput = $state(timeToInput(startTime));
  let endsAtInput = $state(timeToInput(startTime));
</script>

<div class="new-scene">
  <Button variant="secondary" onclick={() => dialog?.toggleDialog()}>
    <AddIcon size={16} />
    New scene
  </Button>
</div>

<DialogForm
  bind:this={dialog}
  title="Add scene"
  submitButtonText="Confirm"
  method="post"
  action={`/projects/${projectId}?/addDisplayScene`}
  class="flex flex-col gap-4"
>
  <input name="displayId" value={displayId} type="hidden" />
  <input name="templateId" value="1" type="hidden" />

  <input
    name="startsAt"
    value={timeToDate(timeFromInput(startsAtInput), baseDateAsDate)}
    type="hidden"
  />
  <input
    name="endsAt"
    value={timeToDate(timeFromInput(endsAtInput), baseDateAsDate)}
    type="hidden"
  />

  <Input name="name" placeholder="Name" type="string" />
  <div style="display: flex">
    <label>
      From
      <TimePicker name="startsAtInput" bind:value={startsAtInput} />
    </label>
    <label>
      To
      <TimePicker name="endsAtInput" bind:value={endsAtInput} />
    </label>
  </div>
</DialogForm>

<style>
  .new-scene {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
