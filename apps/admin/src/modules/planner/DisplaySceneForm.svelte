<script lang="ts">
  import { page } from '$app/state';
  import { Input } from '$components/input/index';
  import { Select } from '$components/select';
  import { Button } from '$components/button';
  import { timeFromInput, timeToDate, toTimeInput } from '$lib/utils';
  import { DisplayScene, type Display, type Template } from '$db/entities';
  import { displaySceneRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import { invalidateAll } from '$app/navigation';
  import { useDialog } from '$components/dialog/index.svelte';
  import { TimePicker } from '$components/time-picker';
  import { routes } from '$lib/routes';
  import AddElement from './AddElement.svelte';
  import ElementsPreview from './ElementsPreview.svelte';
  import PresetOptions from './PresetOptions.svelte';

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;
  let iframeEl = $state() as HTMLIFrameElement;

  let {
    scene
  }: {
    scene: DisplayScene;
  } = $props();

  const dialog = useDialog();

  let mutation = useMutation({
    fn: (id: number, scene: DisplayScene) => displaySceneRepo.update(id, scene),
    onSuccess: async () => {
      await invalidateAll();
    }
  });

  let deleteMutation = useMutation({
    fn: (id: number) => displaySceneRepo.delete(id),
    onSuccess: async () => {
      await invalidateAll();
    }
  });

  let baseDate = new Date(scene.startsAt);
  let startsAtInput = $state(toTimeInput(scene.startsAt));
  let endsAtInput = $state(toTimeInput(scene.endsAt));

  let elements = $state(scene.elements || []);
  let payload = $state(scene.templateConfig);

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
    payload = event.data.value.templateConfig || {};
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    await mutation.mutate(scene.id, {
      ...scene,
      startsAt: timeToDate(timeFromInput(startsAtInput), baseDate),
      endsAt: timeToDate(timeFromInput(endsAtInput), baseDate),
      templateConfig: payload,
      elements: elements
    });

    dialog.close();
  }

  async function handleDelete() {
    await deleteMutation.mutate(scene.id);
    dialog.close();
  }

  let templateOptions = page.data.templates.map((template: Template) => ({
    label: template.name || '',
    value: template.id.toString()
  }));

  let displays = page.data.project.displays.map((display: Display) => ({
    label: display.name || '',
    value: display.id.toString()
  }));
</script>

<svelte:window onmessage={handleMessage} />
<form
  class="grid w-[90vw] grid-cols-4 items-start gap-4"
  onsubmit={handleSubmit}
>
  <div class="col-span-2">
    <Input label="Name" type="text" name="name" bind:value={scene.name} />
  </div>
  <div class="col-span-2">
    <Select
      label="Display"
      options={displays}
      name="displayId"
      bind:value={scene.displayId}
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
      bind:value={scene.templateId}
    />
    <PresetOptions
      bind:scene
      {iframeEl}
      currentConfig={payload}
      bind:currentElements={elements}
    />
  </div>

  <div class="flex">
    <AddElement bind:elements />
  </div>

  <div
    class="relative col-span-4 flex aspect-video w-[90vw] max-w-full items-center justify-center rounded-md"
  >
    <iframe
      bind:this={iframeEl}
      src={routes.SCENE_TEMPLATE(scene.templateId, scene.id)}
      frameborder="0"
      title="Preview"
      onmessage={(e) => {
        console.log('Message received');
        console.log(e);
      }}
      class="h-full w-full"
      allow="camera"
    ></iframe>
    <ElementsPreview bind:elements />
  </div>

  <div class="col-span-4 flex gap-4">
    <Button
      type="button"
      fullWidth
      size="default"
      variant="destructive"
      onclick={handleDelete}
      disabled={deleteMutation.isPending || mutation.isPending}
      isLoading={deleteMutation.isPending}
    >
      Delete
    </Button>
    <Button
      type="submit"
      fullWidth
      size="default"
      disabled={deleteMutation.isPending || mutation.isPending}
      isLoading={mutation.isPending}
    >
      Save
    </Button>
  </div>
</form>
