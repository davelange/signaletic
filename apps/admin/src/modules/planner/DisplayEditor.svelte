<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { Input } from '$components/input';
  import type { Display } from '$db/entities';
  import { displayRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import { getPlannerState } from './planner.svelte';
  import DeleteIcon from 'lucide-svelte/icons/trash';

  const planner = getPlannerState();
  console.log(planner);
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

<div class="mb-10 flex w-full flex-col gap-6">
  {#each planner.allDisplays as display}
    <div class="flex items-end justify-between gap-4">
      <Input bind:value={display.name} type="text" name={display.name} />

      <Button
        onclick={() => updateMutation.mutate(display)}
        disabled={updateMutation.isPending}
        variant="secondary"
        class="text-zinc-600"
      >
        Save
      </Button>
      <div class="shrink-0">
        <Button
          onclick={() => deleteMutation.mutate(display)}
          disabled={deleteMutation.isPending ||
            display.displayScenes.length > 0}
          variant="ghost"
          size="icon"
        >
          <DeleteIcon class="text-destructive h-4 w-4" />
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
    bind:value={formData.name}
    name="name"
    type="text"
    label="Add new display"
    placeholder="New display"
  />
  <Button disabled={addMutation.isPending}>Save</Button>
</form>
