<script lang="ts">
  import { page } from '$app/state';
  import Ably from 'ably';
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import type { DisplayScene, Project, Template } from '$db/entities';
  import SceneCard from './SceneCard.svelte';
  import LiveSceneForm from './LiveSceneForm.svelte';

  let { project }: { project: Project } = $props();

  const dialog = useDialog();

  let allLiveScenes = $derived(
    project.displays.flatMap((display) =>
      display.standaloneScenes().map((scene) => ({
        ...scene,
        display,
        template: page.data.templates.find(
          (item: Template) => item.id === scene.templateId
        )
      }))
    )
  );

  const ably = new Ably.Realtime(import.meta.env.VITE_ABLY_KEY);
  ably.connection.once('connected', () => {
    console.log('Connected to Ably!');
  });

  async function publish(scene: DisplayScene) {
    const channel = ably.channels.get(`${project.id}_${scene.displayId}`);
    await channel.publish('new_scene', scene);
  }

  function edit(scene: DisplayScene) {
    dialog.open({
      title: 'Edit live scene',
      description: '',
      content: LiveSceneForm,
      contentProps: {
        project,
        scene
      }
    });
  }
</script>

<Button
  type="button"
  onclick={() =>
    dialog.open({
      title: 'Add live scene',
      description: '',
      content: LiveSceneForm,
      contentProps: {
        project: page.data.project
      }
    })}
>
  Add live scene
</Button>

<div class="col-span-3 my-4 flex flex-wrap gap-4">
  {#each allLiveScenes as scene}
    <SceneCard {scene} {publish} {edit} />
  {/each}
</div>
