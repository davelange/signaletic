<script lang="ts">
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import DialogForm from '$components/DialogForm.svelte';
  import { Button } from '$components/ui/button';
  import type {
    display as schemaDisplay,
    displayScene,
    scheduleEvent
  } from '$db/src/schema';
  import type { InferSelectModel } from 'drizzle-orm';
  import AddSceneForm from './AddSceneForm.svelte';
  import ActionButton from '$components/ActionButton.svelte';

  let {
    day,
    scenes,
    display,
    projectId
  }: {
    day: Date;
    scenes: (InferSelectModel<typeof displayScene> & {
      scheduleEvent: InferSelectModel<typeof scheduleEvent> | null;
    })[];
    display: InferSelectModel<typeof schemaDisplay>;
    projectId: number;
  } = $props();

  let sceneDialogForm: DialogForm | undefined = $state();
</script>

<div class="flex flex-col gap-4">
  {#each scenes as scene}
    <div class="flex items-center gap-2">
      <p>
        {scene.startsAt.toLocaleDateString()}
        {#if scene.scheduleEventId}
          ({scene.scheduleEvent?.description})
        {/if}
      </p>
      <Button variant="ghost" onclick={() => sceneDialogForm?.toggleDialog()}>
        <SettingsIcon size={16} />
      </Button>

      {#snippet deleteSceneAction()}
        <ActionButton
          variant="destructive"
          type="button"
          action={{
            action: `/projects/${projectId}?/deleteDisplayScene`,
            id: scene.id
          }}
        >
          Delete scene
        </ActionButton>
      {/snippet}

      <DialogForm
        bind:this={sceneDialogForm}
        title="Edit scene"
        submitButtonText="Confirm"
        method="post"
        action={`/projects/${projectId}?/editDisplayScene`}
        class="flex flex-col gap-4"
        altAction={deleteSceneAction}
      >
        <input name="projectId" value={projectId} type="hidden" />
      </DialogForm>
    </div>
  {/each}

  <AddSceneForm projectId={Number(projectId)} displayId={display.id} {day} />
</div>
