<script lang="ts">
  import PlusIcon from 'lucide-svelte/icons/plus';
  import { enhance } from '$app/forms';
  import Button from '$components/ui/button/button.svelte';
  import FormField from '$components/ui/form-field/FormField.svelte';
  import Input from '$components/ui/input/input.svelte';
  import { TimePicker } from '$components/ui/time-picker';

  type Props = {
    projectId: string;
    baseDate: Date;
    prompt: boolean;
  };

  let { baseDate, projectId, prompt = true }: Props = $props();

  let isShowing = $state(!prompt);

  let startsAtInput = $state('');
  let [hour, minute] = $derived(startsAtInput.split(':').map(Number));
  let startsAt = $derived(new Date(baseDate)?.setHours(hour, minute));
</script>

{#if isShowing}
  <form
    method="post"
    action="?/addEvent"
    use:enhance
    class="flex flex-col gap-4"
  >
    <FormField label="Description">
      <Input name="description" type="text" placeholder="New event" />
    </FormField>
    <FormField label="Starts at">
      <div>
        <TimePicker name="startsAtTime" bind:value={startsAtInput} />
      </div>
    </FormField>
    <input name="startsAt" type="hidden" value={startsAt} />
    <input name="projectId" value={projectId} type="hidden" />

    <Button type="submit">Add event</Button>
  </form>
{:else}
  <div
    class="py-10 bg-slate-50 rounded-sm border-dashed border flex justify-center"
  >
    <Button variant="ghost" onclick={() => (isShowing = true)}>
      <PlusIcon size={16} class="mr-1" />
      New Event
    </Button>
  </div>
{/if}
