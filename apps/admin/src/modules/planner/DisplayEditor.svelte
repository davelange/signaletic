<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import { Input } from '$components/input';
  import { displayRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import { getPlannerState } from './planner.svelte';

  const planner = getPlannerState();
  const dialog = useDialog();

  let formData = $state({ name: '', projectId: planner.project.id });

  const addMutation = useMutation({
    fn: () => displayRepo.insert(formData),
    onSuccess: () => {
      invalidateAll();
      dialog.close();
    }
  });
</script>

<form
  class="flex w-full items-end justify-between gap-2"
  onsubmit={(e) => {
    e.preventDefault();
    addMutation.mutate();
  }}
>
  <Input
    bind:value={formData.name}
    name="name"
    type="text"
    placeholder="New display"
  />
  <Button disabled={addMutation.isPending} isLoading={addMutation.isPending}>
    Save
  </Button>
</form>
