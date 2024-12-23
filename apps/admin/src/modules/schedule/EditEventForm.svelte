<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$components/ui/button/button.svelte';
  import FormField from '$components/ui/form-field/FormField.svelte';
  import Input from '$components/ui/input/input.svelte';
  import { TimePicker } from '$components/ui/time-picker';
  import { NiceForm } from '$lib/NiceForm.svelte';
  import Loading from 'lucide-svelte/icons/loader-circle';

  type Props = {
    baseDate: Date;
    event?: {
      id: number;
      projectId: number;
      startsAt: Date;
      description: string | null;
    };
    close: () => void;
  };

  let { baseDate, event, close }: Props = $props();

  function getTimeString(val?: Date) {
    if (!val) return '';

    return `${val.getHours().toString().padStart(2, '0')}:${val.getMinutes().toString().padStart(2, '0')}`;
  }

  let startsAtInput = $state(getTimeString(event?.startsAt));
  let [hour, minute] = $derived(startsAtInput.split(':').map(Number));
  let startsAt = $derived(new Date(baseDate)?.setHours(hour, minute));

  let form = new NiceForm({
    onSuccess: close
  });
</script>

<form
  method="post"
  action="?/editEvent"
  class="flex flex-col gap-4"
  use:enhance={() => form.enhance()}
>
  <FormField label="Description">
    <Input
      name="description"
      type="text"
      placeholder="New event"
      value={event?.description || ''}
    />
  </FormField>
  <FormField label="Starts at">
    <div>
      <TimePicker name="startsAtTime" bind:value={startsAtInput} />
    </div>
  </FormField>
  <input name="startsAt" type="hidden" value={startsAt} />
  <input name="id" type="hidden" value={event?.id} />
  <input name="projectId" value={event?.projectId} type="hidden" />

  <div class="flex gap-2 mt-4">
    <Button type="button" variant="ghost" class="w-full" onclick={close}>
      Cancel
    </Button>
    <Button
      type="submit"
      class="flex items-center w-full relative"
      variant="outline"
    >
      {#if form.isLoading}
        <Loading size={14} class="mr-1 animate-spin" />
      {/if}
      Save
    </Button>
  </div>
</form>
