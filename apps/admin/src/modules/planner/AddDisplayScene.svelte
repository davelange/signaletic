<script lang="ts">
  import { Input } from '$components/input';
  import {
    calendarDateToDate,
    timeFromInput,
    timeToDate,
    timeToInput
  } from '$lib/utils';
  import type { CalendarDate, Time } from '@internationalized/date';
  import { Select } from '$components/select';
  import { page } from '$app/state';
  import { Button } from '$components/button';
  import { DisplayScene, type Display, type Template } from '$db/entities';
  import { useMutation } from '$lib/api.svelte';
  import { invalidateAll } from '$app/navigation';
  import { TimePicker } from '$components/time-picker';
  import { routes } from '$lib/routes';
  import { repo, type MembersOnly } from 'remult';
  import AddElement from './AddElement.svelte';
  import ElementsPreview from './ElementsPreview.svelte';
  import PresetOptions from './PresetOptions.svelte';

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

  let iframeEl = $state() as HTMLIFrameElement;

  let {
    displayId,
    baseDate,
    startTime
  }: {
    displayId?: number;
    baseDate: CalendarDate;
    startTime: Time;
  } = $props();

  let formState: Partial<MembersOnly<DisplayScene>> = $state({
    displayId,
    templateId: 0,
    standalone: false,
    namee: ''
  });
  let mutation = useMutation({
    fn: async (scene: typeof formState) => {
      return repo(DisplayScene).insert(scene);
    },
    onSuccess: () => {
      invalidateAll();
    }
  });

  let elements: DisplayScene['elements'] = $state([]);
  let payload: DisplayScene['templateConfig'] = $state({});

  function handleMessage(event: MessageEvent) {
    if (
      event.origin !== VISUALIZER_URL ||
      event.data.type !== 'templateConfigUpdate'
    ) {
      return;
    }

    payload = event.data.value.templateConfig || {};
    elements = event.data.value.elements || [];
  }

  let baseDateAsDate = calendarDateToDate(baseDate);
  let startsAtInput = $state(timeToInput(startTime));
  let endsAtInput = $state(timeToInput(startTime));

  let templateOptions = page.data.templates.map((template: Template) => ({
    label: template.name || '',
    value: template.id.toString()
  }));

  let displays = page.data.project.displays.map((display: Display) => ({
    label: display.name || '',
    value: display.id.toString()
  }));

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    mutation.mutate({
      ...formState,
      templateId: Number(formState.templateId),
      startsAt: timeToDate(timeFromInput(startsAtInput), baseDateAsDate),
      endsAt: timeToDate(timeFromInput(endsAtInput), baseDateAsDate),
      templateConfig: $state.snapshot(payload),
      elements: $state.snapshot(elements)
    });
  }
</script>

<svelte:window onmessage={handleMessage} />
<form
  class="grid w-[90vw] grid-cols-4 items-start gap-4"
  onsubmit={handleSubmit}
>
  <div class="col-span-2">
    <Input
      label="Name"
      type="text"
      name="name"
      placeholder="Scene name"
      required
      bind:value={formState.name}
    />
  </div>

  <div class="col-span-2">
    <Select
      label="Display"
      options={displays}
      name="displayId"
      bind:value={formState.displayId}
    />
  </div>

  <div class="col-span-2 flex gap-4">
    <TimePicker label="From" name="startsAtInput" bind:value={startsAtInput} />
    <TimePicker label="To" name="endsAtInput" bind:value={endsAtInput} />
  </div>

  <div class="col-span-2 flex items-end gap-4">
    <Select
      label="Template"
      options={templateOptions}
      name="templateId"
      bind:value={formState.templateId}
    />
    <PresetOptions
      bind:scene={formState}
      {iframeEl}
      currentConfig={payload}
      currentElements={elements}
    />
  </div>

  <div class="flex">
    <AddElement bind:elements />
  </div>
  <div
    class="relative col-span-4 flex aspect-video w-[90vw] max-w-full items-center justify-center overflow-hidden rounded-md bg-slate-100"
  >
    {#if formState.templateId}
      <iframe
        bind:this={iframeEl}
        src={routes.TEMPLATE(formState.templateId)}
        frameborder="0"
        title="Preview"
        onmessage={(e) => {
          console.log(e);
        }}
        class="h-full w-full"
      ></iframe>
    {/if}
    <ElementsPreview bind:elements />
  </div>
  <div class="col-span-4 flex gap-4">
    <Button
      type="submit"
      fullWidth
      size="default"
      disabled={mutation.isPending}
      isLoading={mutation.isPending}
    >
      Save
    </Button>
  </div>
</form>
