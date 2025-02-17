<script lang="ts">
  import PlusIcon from 'lucide-svelte/icons/plus';
  import Button from '$components/ui/button/button.svelte';
  import FormField from '$components/ui/form-field/FormField.svelte';
  import DialogForm from '$components/DialogForm.svelte';
  import { TimePicker } from '$components/time-picker';
  import { page } from '$app/state';
  import { getItemsInDay } from '$lib/utils';
  import { useTimePicker } from '$components/time-picker/timePicker.svelte';

  type Props = {
    displayId: number;
    projectId: number;
    day: Date;
  };

  let { displayId, projectId, day }: Props = $props();

  let dialogForm: DialogForm;
  let eventsToPick = getItemsInDay(page.data.scheduleEvents || [], day);
  let timePicker = useTimePicker({
    baseDate: day
  });
</script>

<div class="my-2">
  <DialogForm
    bind:this={dialogForm}
    title="Add new scene"
    submitButtonText="Add scene"
    method="post"
    action={`/projects/${projectId}?/addDisplayScene`}
    class="flex flex-col gap-4"
  >
    <FormField label="Attach to event">
      <select
        name="scheduleEventId"
        id=""
        onchange={(event) => {
          const match = page.data.scheduleEvents.find(
            ({ id }) => id === Number(event.currentTarget.value)
          );
          timePicker.setTime(match!.startsAt);
        }}
      >
        <option value="">None</option>
        {#each eventsToPick as event}
          <option value={event.id}>{event.description}</option>
        {/each}
      </select>
    </FormField>

    <FormField label="Start showing at">
      <TimePicker name="startsAtTime" bind:value={timePicker.inputValue} />
    </FormField>

    <input name="displayId" value={displayId} type="hidden" />
    <input name="startsAt" type="hidden" value={timePicker.dateValue} />
  </DialogForm>
  <div
    class="flex justify-center rounded-md border border-dashed border-slate-300 bg-slate-50"
  >
    <Button
      variant="ghost"
      onclick={() => dialogForm.toggleDialog()}
      class="w-full"
    >
      <PlusIcon size={16} class="mr-1" />
      Add Scene
    </Button>
  </div>
</div>
