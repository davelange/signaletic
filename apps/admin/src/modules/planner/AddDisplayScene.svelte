<script lang="ts">
  import { Input } from '$components/input';
  import {
    calendarDateToDate,
    timeFromInput,
    timeToDate,
    timeToInput
  } from '$lib/utils';
  import { TimePicker } from '$components/time-picker';
  import type { CalendarDate, Time } from '@internationalized/date';
  import { Select } from '$components/select';
  import { page } from '$app/state';
  import { Button } from '$components/button';
  import { displaySceneRepo } from '$db/lib';
  import { type Display, type Template } from '$db/entities';

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

  let {
    displayId,
    baseDate,
    startTime
  }: {
    displayId?: number;
    baseDate: CalendarDate;
    startTime: Time;
  } = $props();

  let mutation = $state({
    name: '',
    templateId: 0,
    displayId
  });

  let baseDateAsDate = calendarDateToDate(baseDate);
  let startsAtInput = $state(timeToInput(startTime));
  let endsAtInput = $state(timeToInput(startTime));

  let templateOptions = page.data.templates.map((template: Template) => ({
    label: template.name || '',
    value: template.id
  }));

  let displays = page.data.project.displays.map((display: Display) => ({
    label: display.name || '',
    value: display.id
  }));

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    await displaySceneRepo.insert({
      ...mutation,
      startsAt: timeToDate(timeFromInput(startsAtInput), baseDateAsDate),
      endsAt: timeToDate(timeFromInput(endsAtInput), baseDateAsDate)
    });
  }
</script>

<form class="flex w-full flex-col gap-4" onsubmit={handleSubmit}>
  <div class="flex flex-1 gap-4">
    <div class="w-full flex-1">
      <Input
        label="Name"
        type="text"
        name="name"
        placeholder="Scene name"
        required
        bind:value={mutation.name}
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
      bind:value={mutation.displayId}
    />
    <Select
      label="Template"
      options={templateOptions}
      name="templateId"
      bind:value={mutation.templateId}
    />
  </div>

  <div
    class="flex aspect-video w-[1000px] items-center justify-center bg-slate-100"
  >
    {#if mutation.templateId}
      <iframe
        src={`${VISUALIZER_URL}/edit/template/${mutation.templateId}`}
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
