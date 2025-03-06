<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import { Input } from '$components/input';
  import { Project } from '$db/entities';
  import { useMutation } from '$lib/api.svelte';
  import { generateSlug } from '$lib/utils';
  import { repo } from 'remult';

  let project = repo(Project).create();
  let mutation = useMutation({
    fn: () => repo(Project).insert(project),
    onSuccess: () => invalidateAll()
  });
  const dialog = useDialog();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    project.slug = generateSlug(project.name!);
    await mutation.mutate();

    dialog.close();
  };
</script>

<form action="" onsubmit={handleSubmit} class="flex w-full items-end gap-4">
  <Input
    type="text"
    id="name"
    name="name"
    label="Name"
    required
    bind:value={project.name}
  />
  <Button
    type="submit"
    disabled={mutation.isPending}
    isLoading={mutation.isPending}
  >
    Create
  </Button>
</form>
