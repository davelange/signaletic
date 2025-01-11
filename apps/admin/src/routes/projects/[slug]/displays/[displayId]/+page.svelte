<script lang="ts">
  import ActionButton from '$components/ActionButton.svelte';
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import AddDay from '$components/AddDay.svelte';
  import DayWrapper from '$components/DayWrapper.svelte';
  import DialogForm from '$components/DialogForm.svelte';
  import { Button } from '$components/ui/button';
  import { getEventDays, getItemsInDay } from '$lib/utils';
  import type { PageData } from './$types';
  import FormField from '$components/ui/form-field/FormField.svelte';
  import { Input } from '$components/ui/input';
  import SceneList from '$modules/displays/SceneList.svelte';

  let { data }: { data: PageData } = $props();
  let displayDialogForm: DialogForm;

  let eventDays = $state(getEventDays(data.scheduleEvents));
</script>

{#snippet deleteDisplayAction()}
  <ActionButton
    variant="destructive"
    type="button"
    action={{
      action: `/projects/${data.id}?/deleteDisplay`,
      displayId: data.display.id
    }}
  >
    Delete display
  </ActionButton>
{/snippet}

<section>
  <div class="mb-4 flex items-center gap-2">
    <p class="text-lg font-bold">{data.display.name}</p>
    <Button variant="ghost" onclick={() => displayDialogForm.toggleDialog()}>
      <SettingsIcon size={16} />
    </Button>
    <DialogForm
      bind:this={displayDialogForm}
      title="Edit display"
      submitButtonText="Confirm"
      method="post"
      action={`/projects/${data.id}?/addDisplay`}
      class="flex flex-col gap-4"
      altAction={deleteDisplayAction}
    >
      <FormField label="Name">
        <Input
          name="name"
          type="text"
          placeholder="TV #1"
          value={data.display.name}
          required
        />
      </FormField>

      <input name="projectId" value={data.id} type="hidden" />
    </DialogForm>
  </div>
  <div class="flex gap-8">
    {#each eventDays as day}
      <DayWrapper {day}>
        <div class="flex flex-col gap-4">
          <SceneList
            {day}
            scenes={getItemsInDay(data.display.displayScenes, day)}
            display={data.display}
            projectId={data.id}
          />
        </div>
      </DayWrapper>
    {/each}
    <AddDay
      onSubmit={(value) => {
        eventDays.push(value);
      }}
    />
  </div>
</section>
