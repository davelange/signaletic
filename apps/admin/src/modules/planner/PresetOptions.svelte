<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$components/button';
  import { Input } from '$components/input';
  import { Select } from '$components/select';
  import { type DisplayScene, Preset } from '$db/entities';
  import { useMutation } from '$lib/api.svelte';
  import { Popover } from 'bits-ui';
  import { repo, type MembersOnly } from 'remult';

  let {
    scene = $bindable(),
    currentConfig,
    currentElements,
    iframeEl
  }: {
    scene: Partial<MembersOnly<DisplayScene>>;
    currentConfig: DisplayScene['templateConfig'];
    currentElements: DisplayScene['elements'];
    iframeEl: HTMLIFrameElement;
  } = $props();

  let newPreset = repo(Preset).create();
  let createMutation = useMutation({
    fn: async () =>
      repo(Preset).insert({
        name: newPreset.name,
        templateId: scene.templateId,
        templateConfig: JSON.stringify(currentConfig),
        elements: JSON.stringify(currentElements)
      }),
    onSuccess: () => invalidateAll()
  });

  let presetOptions = $derived(
    page.data.presets
      .filter(
        (preset: Preset) => preset.templateId === Number(scene.templateId)
      )
      .map((preset: Preset) => ({
        label: preset.name || '',
        value: preset.id.toString()
      }))
  );

  function handlePresetSelect(id: number) {
    const preset = page.data.presets.find((item: Preset) => item.id === id);

    if (preset) {
      iframeEl.contentWindow?.postMessage(
        {
          type: 'templatePresetUpdate',
          templateConfig: preset.templateConfig,
          elements: preset.elements
        },
        import.meta.env.VITE_VISUALIZER_URL
      );
    }
  }
</script>

{#if presetOptions.length}
  <Select
    label="Preset"
    options={presetOptions}
    name="presetId"
    onValueChange={(val) => handlePresetSelect(Number(val))}
  />
{/if}

<!-- <Button variant="secondary" type="button">Save config as preset</Button> -->
<Popover.Root>
  <Popover.Trigger
    class="rounded-input bg-dark
        text-background shadow-mini hover:bg-dark/95 active:scale-98 whitespace-nowratransition-all inline-flex h-10 select-none items-center justify-center hover:cursor-pointer"
  >
    <Button variant="secondary" type="button">Save config as preset</Button>
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      class="border-dark-10 bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-full max-w-[500px] rounded-[12px] border p-4"
      sideOffset={8}
    >
      <div class="flex gap-2">
        <Input placeholder="Preset name" bind:value={newPreset.name} />
        <Button
          type="button"
          onclick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          isLoading={createMutation.isPending}
        >
          Save
        </Button>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
