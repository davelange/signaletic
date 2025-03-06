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

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

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

    payload = event.data.value;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    await mutation.mutate(scene.id, {
      ...scene,
      startsAt: timeToDate(timeFromInput(startsAtInput), baseDate),
      endsAt: timeToDate(timeFromInput(endsAtInput), baseDate),
      templateConfig: JSON.stringify(payload)
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
<form class="flex w-full flex-col gap-4" onsubmit={handleSubmit}>
  <div class="flex flex-1 gap-4">
    <div class="w-full flex-1">
      <Input label="Name" type="text" name="name" bind:value={scene.name} />
    </div>

    <Select
      label="Display"
      options={displays}
      name="displayId"
      bind:value={scene.displayId}
    />
    <Select
      label="Template"
      options={templateOptions}
      name="templateId"
      bind:value={scene.templateId}
    />
  </div>

  <div class="flex flex-1 gap-4">
    <TimePicker label="From" name="startsAtInput" bind:value={startsAtInput} />
    <TimePicker label="To" name="endsAtInput" bind:value={endsAtInput} />
  </div>

  <div class="flex items-center gap-4">
    <a
      href={`${VISUALIZER_URL}/1/displays/2`}
      class="text-blue-600 underline"
      target="_blank"
    >
      Preview
    </a>
  </div>

  <div
    class="flex aspect-video w-[90vw] max-w-full items-center justify-center"
  >
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

  <div class="flex gap-4">
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
