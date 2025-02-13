<script lang="ts">
  import { page } from '$app/state';
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

  let payload = $state();
  let payloadJSON = $derived(JSON.stringify(payload));

  $effect(() => {
    startsAtInput = toTimeInput(scene.startsAt);
    endsAtInput = toTimeInput(scene.endsAt);
  });

  function handleMessage(event: MessageEvent) {
    if (
      event.origin !== 'http://localhost:5174' ||
      event.data.type !== 'templateConfigUpdate'
    ) {
      return;
    }

    payload = event.data.value;
  }
</script>

<svelte:window onmessage={handleMessage} />
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
  <input name="templateConfig" value={payloadJSON} type="hidden" />
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
  <div>
    <label>
      Template
      <select name="templateId" id="" value={scene.templateId}>
        {#each page.data.templates as template}
          <option value={template.id}>{template.name}</option>
        {/each}
      </select>
    </label>
  </div>
  <iframe
    src={`http://localhost:5174/edit/${scene.id}`}
    frameborder="0"
    title="Preview"
    onmessage={(e) => {
      console.log(e);
    }}
  ></iframe>
</DialogForm>
