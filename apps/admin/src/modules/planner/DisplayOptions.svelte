<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import { Input } from '$components/input';
  import Select from '$components/select/Select.svelte';
  import type { Display } from '$db/entities';
  import { displayRepo } from '$db/lib';
  import { useMutation } from '$lib/api.svelte';
  import { routes } from '$lib/routes';
  import { formatCalendarDate } from '$lib/utils';
  import { getPlannerState } from './planner.svelte';
  import LinkIcon from '@lucide/svelte/icons/square-arrow-out-up-right';
  import DeleteIcon from '@lucide/svelte/icons/trash';

  let { display }: { display: Display } = $props();

  const planner = getPlannerState();
  const dialog = useDialog();

  let selectedDate = $state('');

  const updateMutation = useMutation({
    fn: (item: Display) => displayRepo.update(item.id, item),
    onSuccess: () => {
      invalidateAll();
      dialog.close();
    }
  });

  const deleteMutation = useMutation({
    fn: (item: Display) => displayRepo.delete(item.id),
    onSuccess: () => {
      invalidateAll();
      dialog.close();
    }
  });

  let dateOptions = planner.dates.map((date) => ({
    label: formatCalendarDate(date),
    value: date.toString()
  }));

  let href = $derived(
    routes.DISPLAY(planner.project.id, display.id, selectedDate)
  );
</script>

<div class="mb-10 flex w-full items-end gap-2">
  <div class="flex-1">
    <Input
      label="Name"
      bind:value={display.name}
      type="text"
      name={display.name}
    />
  </div>

  <Button
    onclick={() => updateMutation.mutate(display)}
    disabled={updateMutation.isPending}
    isLoading={updateMutation.isPending}
  >
    Save
  </Button>
  <Button
    onclick={() => deleteMutation.mutate(display)}
    disabled={deleteMutation.isPending || display.displayScenes.length > 0}
    isLoading={deleteMutation.isPending}
    variant="outline"
    size="icon"
    title="Delete display"
  >
    <DeleteIcon class="size-4" />
  </Button>
</div>

<p class="text-s text-slate-700">Open visualizer for this display</p>
<div class="mb-10 flex w-full items-stretch gap-1">
  <Select
    bind:value={selectedDate}
    options={[
      {
        label: 'Current date',
        value: ''
      },
      ...dateOptions
    ]}
  />
  <Button {href} target="_blank">
    Open view
    <LinkIcon class="ml-2 size-3" />
  </Button>
</div>
