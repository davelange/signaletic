<script lang="ts">
  import { page } from '$app/state';
  import { useDialog } from '$components/dialog/index.svelte';
  import { Input } from '$components/input';
  import { repo } from 'remult';
  import { Project } from '$db/entities';
  import { useMutation } from '$lib/api.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { generateSlug, omit } from '$lib/utils';

  let project = repo(Project).create(page.data.project);
  const dialog = useDialog();

  let mutation = useMutation({
    fn: () => repo(Project).update(project.id, omit(project, 'id')),
    onSuccess: () => invalidateAll()
  });
  let deleteMutation = useMutation({
    fn: () => repo(Project).delete(project.id),
    onSuccess: () => invalidateAll()
  });

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    project.slug = generateSlug(project.name!);
    await mutation.mutate();
    await goto(`/projects/${project.slug}`, {
      replaceState: true
    });
    dialog.close();
  };

  async function handleDelete() {
    await deleteMutation.mutate();
    await goto(`/`, {
      replaceState: true
    });
    dialog.close();
  }
</script>

<form
  action=""
  onsubmit={handleSubmit}
  class="mb-4 flex w-full items-end justify-between gap-4"
>
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
    Save changes
  </Button>
</form>
<div class="flex w-full justify-end">
  <Button
    type="button"
    variant="destructive"
    disabled={deleteMutation.isPending}
    isLoading={deleteMutation.isPending}
    onclick={handleDelete}
  >
    Delete project
  </Button>
</div>
