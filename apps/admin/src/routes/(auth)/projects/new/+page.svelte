<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { Input } from '$components/input';
  import { Project } from '$db/entities';
  import { useMutation } from '$lib/api.svelte';
  import { repo } from 'remult';

  let project = repo(Project).create();
  let mutation = useMutation({
    fn: (data) => repo(Project).insert(data),
    onSuccess: () => invalidateAll()
  });

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    console.log(project);
    await mutation.mutate(project);
  };
</script>

<form action="" onsubmit={handleSubmit} class="flex items-end gap-4">
  <Input
    type="text"
    id="name"
    name="name"
    label="Name"
    bind:value={project.name}
  />
  <Button type="submit" disabled={mutation.isPending}>Create</Button>
</form>
