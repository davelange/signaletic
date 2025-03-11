<script lang="ts">
  import { Button } from '$components/button';
  import * as Card from '$components/card';
  import type { DisplayScene } from '$db/entities';
  import { useMutation } from '$lib/api.svelte';

  let {
    scene,
    publish,
    edit
  }: {
    scene: DisplayScene;
    publish: (scene: DisplayScene) => Promise<void>;
    edit: (scene: DisplayScene) => void;
  } = $props();

  let mutation = useMutation({
    fn: () => publish(scene)
  });
</script>

<Card.Root class="w-[350px]">
  <Card.Header>
    <Card.Title>{scene.name}</Card.Title>
    <Card.Description
      >{scene.display.name}, Template: {scene.template.name}</Card.Description
    >
  </Card.Header>
  <Card.Content class="flex gap-4">
    <Button
      variant="secondary"
      type="button"
      onclick={() => edit(scene)}
      isLoading={mutation.isPending}
    >
      Edit
    </Button>
    <Button
      type="button"
      onclick={() => mutation.mutate()}
      isLoading={mutation.isPending}
    >
      Show now
    </Button>
  </Card.Content>
</Card.Root>
