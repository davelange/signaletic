<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { Input } from '$components/input';
  import type { Display } from '$db/entities';
  import { displayRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import { getPlannerState } from './planner.svelte';
  import SaveIcon from 'lucide-svelte/icons/save';
  import DeleteIcon from 'lucide-svelte/icons/trash';

  const planner = getPlannerState();
  let formData = $state({ name: '', projectId: planner.project.id });

  const updateMutation = useMutation({
    fn: (item: Display) => displayRepo.update(item.id, item),
    onSuccess: () => {
      invalidateAll();
    }
  });

  const deleteMutation = useMutation({
    fn: (item: Display) => displayRepo.delete(item.id),
    onSuccess: () => {
      invalidateAll();
    }
  });

  const addMutation = useMutation({
    fn: (item: typeof formData) => displayRepo.insert(item),
    onSuccess: () => {
      invalidateAll();
    }
  });
</script>

<div class="mb-10 flex w-full flex-col gap-4">
  {#each planner.allDisplays as display}
    <div class="flex items-end justify-between">
      <Input bind:value={display.name} type="text" label="Name" />

      <div class="mb-2 ml-auto flex justify-end gap-4">
        <Button
          onclick={() => updateMutation.mutate(display)}
          disabled={updateMutation.isPending}
          variant="ghost"
          size="sm"
          class="text-zinc-600"
        >
          <SaveIcon />
        </Button>
        <Button
          onclick={() => deleteMutation.mutate(display)}
          disabled={deleteMutation.isPending ||
            display.displayScenes.length > 0}
          variant="ghost"
          size="sm"
          class="text-red-400"
        >
          <DeleteIcon />
        </Button>
      </div>
    </div>
  {/each}
</div>
<form
  class="flex w-full items-end justify-between"
  onsubmit={(e) => {
    e.preventDefault();
    addMutation.mutate(formData);
  }}
>
  <Input
    name="name"
    bind:value={formData.name}
    type="text"
    label="Name"
    placeholder="New display"
  />
  <Button disabled={addMutation.isPending}>Save</Button>
</form>
