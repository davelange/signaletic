<script lang="ts">
  import { NiceForm } from '$lib/NiceForm.svelte';
  import { Input } from '$components/input';
  import {
    calendarDateToDate,
    timeFromInput,
    timeToDate,
    timeToInput
  } from '$lib/utils';
  import { TimePicker } from '$components/time-picker';
  import type { CalendarDate, Time } from '@internationalized/date';
  import { enhance } from '$app/forms';
  import { Select } from '$components/select';
  import { page } from '$app/state';
  import { Button } from '$components/button';

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

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

  let baseDateAsDate = calendarDateToDate(baseDate);
  let startsAtInput = $state(timeToInput(startTime));
  let endsAtInput = $state(timeToInput(startTime));

  $inspect({ baseDate, baseDateAsDate, startsAtInput, endsAtInput });

  let templateOptions = page.data.templates.map((template) => ({
    label: template.name || '',
    value: template.id.toString()
  }));

  let templateId = $state('');

  let form = new NiceForm({});

  let displays = page.data.project.displays.map((display) => ({
    label: display.name || '',
    value: display.id.toString()
  }));
</script>

<form
  method="post"
  action={`/projects/${projectId}?/addDisplayScene`}
  class="flex w-full flex-col gap-4"
  use:enhance={() => form.enhance()}
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

  <div class="flex flex-1 gap-4">
    <div class="w-full flex-1">
      <Input
        label="Name"
        type="text"
        name="name"
        placeholder="Scene name"
        required
      />
    </div>

    <TimePicker label="From" name="startsAtInput" bind:value={startsAtInput} />
    <TimePicker label="To" name="endsAtInput" bind:value={endsAtInput} />
  </div>
  <div class="flex gap-4">
    <Select
      label="Display"
      options={displays}
      name="displayId"
      bind:value={displayId}
    />
    <Select
      label="Template"
      options={templateOptions}
      name="templateId"
      bind:value={templateId}
    />
  </div>

  <div
    class="flex aspect-video w-[1000px] items-center justify-center bg-slate-100"
  >
    {#if templateId}
      <iframe
        src={`${VISUALIZER_URL}/edit/template/${templateId}`}
        frameborder="0"
        title="Preview"
        onmessage={(e) => {
          console.log(e);
        }}
        class="h-full w-full"
      ></iframe>
    {/if}
  </div>
  <Button type="submit" fullWidth size="default">Save</Button>
</form>
