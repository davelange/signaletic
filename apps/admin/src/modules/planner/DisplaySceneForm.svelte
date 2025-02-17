<script lang="ts">
  import { page } from '$app/state';
  import { Input } from '$components/input/index';
  import { Select } from '$components/select';
  import { TimePicker } from '$components/time-picker';
  import { Button } from '$components/button';
  import type { displayScene } from '$db/src/schema';
  import { timeFromInput, timeToDate, toTimeInput } from '$lib/utils';
  import { enhance } from '$app/forms';
  import { NiceForm } from '$lib/NiceForm.svelte';

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

  let {
    projectId,
    scene
  }: {
    projectId: number;
    scene: typeof displayScene.$inferSelect;
  } = $props();

  let baseDate = new Date(scene.startsAt);
  let startsAtInput = $state(toTimeInput(scene.startsAt));
  let endsAtInput = $state(toTimeInput(scene.endsAt));

  let payload = $state(scene.templateConfig);
  let payloadJSON = $derived(JSON.stringify(payload));

  $effect(() => {
    startsAtInput = toTimeInput(scene.startsAt);
    endsAtInput = toTimeInput(scene.endsAt);
  });

  function handleMessage(event: MessageEvent) {
    if (
      event.origin !== VISUALIZER_URL ||
      event.data.type !== 'templateConfigUpdate'
    ) {
      return;
    }

    payload = event.data.value;
  }

  let templateOptions = page.data.templates.map((template) => ({
    label: template.name || '',
    value: template.id.toString()
  }));

  let form = new NiceForm({});
</script>

<svelte:window onmessage={handleMessage} />
<form
  method="post"
  action={`/projects/${projectId}?/editDisplayScene`}
  class="flex w-full flex-col gap-4"
  use:enhance={() => form.enhance()}
>
  <div class="flex w-full max-w-[400px] flex-col gap-4">
    <Input label="Name" type="text" name="name" bind:value={scene.name} />
    <div class="flex w-full gap-4">
      <TimePicker
        label="From"
        name="startsAtInput"
        bind:value={startsAtInput}
      />
      <TimePicker label="To" name="endsAtInput" bind:value={endsAtInput} />
    </div>
    <div>
      <Select
        label="Template"
        options={templateOptions}
        name="templateId"
        bind:value={scene.templateId}
      />
    </div>
  </div>

  <div class="flex aspect-video w-[1000px] items-center justify-center">
    <iframe
      src={`${VISUALIZER_URL}/edit/${scene.id}`}
      frameborder="0"
      title="Preview"
      onmessage={(e) => {
        console.log(e);
      }}
      class="h-full w-full"
    ></iframe>
  </div>

  <input name="id" value={scene.id} type="hidden" />
  <input name="displayId" value={scene.displayId} type="hidden" />
  <input name="scheduleEventId" value={scene.scheduleEventId} type="hidden" />
  <input name="templateConfig" value={payloadJSON} type="hidden" />
  <input
    name="startsAt"
    value={timeToDate(timeFromInput(startsAtInput), baseDate)}
    type="hidden"
  />
  <input
    name="endsAt"
    value={timeToDate(timeFromInput(endsAtInput), baseDate)}
    type="hidden"
  />

  <Button type="submit" fullWidth size="default">Save</Button>
</form>
