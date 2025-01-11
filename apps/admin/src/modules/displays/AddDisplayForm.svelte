<script lang="ts">
  import PlusIcon from 'lucide-svelte/icons/plus';
  import Button from '$components/ui/button/button.svelte';
  import FormField from '$components/ui/form-field/FormField.svelte';
  import Input from '$components/ui/input/input.svelte';
  import DialogForm from '$components/DialogForm.svelte';

  type Props = {
    projectId: string;
  };

  let { projectId }: Props = $props();

  let dialogForm: DialogForm;
</script>

<div class="my-2">
  <DialogForm
    bind:this={dialogForm}
    title="Add new display"
    submitButtonText="Add display"
    method="post"
    action={`/projects/${projectId}?/addDisplay`}
    class="flex flex-col gap-4"
  >
    <FormField label="Name">
      <Input name="name" type="text" placeholder="TV #1" required />
    </FormField>

    <input name="projectId" value={projectId} type="hidden" />
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
      Add Display
    </Button>
  </div>
</div>
