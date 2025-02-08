<script lang="ts">
  import DialogForm from '$components/DialogForm.svelte';
  import { Input } from '$components/ui/input';
  import { TimePicker } from '$components/ui/time-picker';
  import type { displayScene } from '$db/src/schema';
  import { timeFromInput, timeToDate, toTimeInput } from '$lib/utils';

  let {
    sceneDialogForm = $bindable(),
    projectId,
    scene
  }: {
    sceneDialogForm: DialogForm | undefined;
    projectId: number;
    scene: typeof displayScene.$inferSelect;
  } = $props();

  let baseDate = new Date(scene.startsAt);
  let startsAtInput = $state(toTimeInput(scene.startsAt));
  let endsAtInput = $state(toTimeInput(scene.endsAt));

  $effect(() => {
    startsAtInput = toTimeInput(scene.startsAt);
    endsAtInput = toTimeInput(scene.endsAt);
  });
</script>

<DialogForm
  bind:this={sceneDialogForm}
  title="Edit scene"
  submitButtonText="Confirm"
  method="post"
  action={`/projects/${projectId}?/editDisplayScene`}
  class="flex flex-col gap-4"
>
  <input name="id" value={scene.id} type="hidden" />
  <input name="displayId" value={scene.displayId} type="hidden" />
  <input name="scheduleEventId" value={scene.scheduleEventId} type="hidden" />
  <input name="templateId" value={scene.templateId} type="hidden" />
  <input
    name="startsAt"
    value={timeToDate(timeFromInput(startsAtInput), baseDate)}
    type="hidden"
  />
  <input
    name="endsAt"
    value={timeToDate(timeFromInput(endsAtInput), baseDate)}
    type="hidden"
  />
  <Input name="name" placeholder="Name" value={scene.name} type="string" />
  <div style="display: flex">
    <label>
      From
      <TimePicker name="startsAtInput" bind:value={startsAtInput} />
    </label>
    <label>
      To
      <TimePicker name="endsAtInput" bind:value={endsAtInput} />
    </label>
  </div>
</DialogForm>
