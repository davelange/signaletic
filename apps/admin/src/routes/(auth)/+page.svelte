<script lang="ts">
  import Button from '$components/button/Button.svelte';
  import { useDialog } from '$components/dialog/index.svelte.js';
  import Header from '$components/layout/Header.svelte';
  import { routes } from '$lib/routes.js';
  import AddProject from '$modules/project/AddProject.svelte';

  let { data } = $props();

  const dialog = useDialog();
</script>

<Header breadcrumbs={[{ label: 'All projects', href: routes.HOME }]} />

<ul class="flex flex-col">
  {#each data.projects as project (project.id)}
    <li>
      <a class="w-fit underline" href={routes.PROJECT(project.slug)}>
        <p class="text-lg font-semibold">{project.name}</p>
      </a>
    </li>
  {/each}
</ul>

<div class="col-span-3">
  <Button
    type="button"
    onclick={() => {
      dialog.open({
        title: 'Create new project',
        description: '',
        content: AddProject,
        contentProps: {}
      });
    }}
  >
    Add new project
  </Button>
</div>
