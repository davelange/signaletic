<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import { Input } from '$components/input';
  import { Select } from '$components/select';
  import type { Display, DisplayScene, Project, Template } from '$db/entities';
  import { displaySceneRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import { routes } from '$lib/routes';
  import AddElement from '$modules/planner/AddElement.svelte';
  import ElementsPreview from '$modules/planner/ElementsPreview.svelte';

  const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

  let {
    project,
    scene: inputScene = $bindable()
  }: { project: Project; scene?: DisplayScene } = $props();

  const dialog = useDialog();

  let scene =
    inputScene ||
    displaySceneRepo.create({
      standalone: true,
      startsAt: new Date(),
      endsAt: new Date(),
      displayId: project.displays.at(0)!.id
    });

  let elements: DisplayScene['elements'] = $state([]);
  let templateConfig: DisplayScene['templateConfig'] = $state({});

  let mutation = useMutation({
    fn: () =>
      inputScene
        ? displaySceneRepo.update(scene.id, scene)
        : displaySceneRepo.insert(scene),

    onSuccess: async () => {
      await invalidateAll();
      dialog.close();
    }
  });

  let templateOptions = page.data.templates.map((template: Template) => ({
    label: template.name || '',
    value: template.id.toString()
  }));

  let displays = page.data.project.displays.map((display: Display) => ({
    label: display.name || '',
    value: display.id.toString()
  }));

  function handleMessage(event: MessageEvent) {
    if (
      event.origin !== VISUALIZER_URL ||
      event.data.type !== 'templateConfigUpdate'
    ) {
      return;
    }

    templateConfig = event.data.value.templateConfig || {};
    elements = event.data.value.elements || [];
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    scene.elements = elements;
    scene.templateConfig = templateConfig;
    await mutation.mutate();
  }
</script>

<svelte:window onmessage={handleMessage} />
<form class="flex w-full flex-col gap-4" onsubmit={handleSubmit}>
  <div class="flex flex-1 gap-4">
    <div class="w-full flex-1">
      <Input
        label="Name"
        type="text"
        name="name"
        placeholder="Scene name"
        required
        bind:value={scene.name}
      />
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
  <div class="flex">
    <AddElement bind:elements />
  </div>
  <div
    class="relative flex aspect-video w-[90vw] max-w-full items-center justify-center bg-slate-100"
  >
    {#if scene.templateId}
      <iframe
        src={routes.SCENE_TEMPLATE(scene.templateId, scene.id)}
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
  <Button
    type="submit"
    fullWidth
    size="default"
    disabled={mutation.isPending}
    isLoading={mutation.isPending}
  >
    Save
  </Button>
</form>
