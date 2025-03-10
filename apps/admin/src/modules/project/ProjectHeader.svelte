<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import type { PageData } from '../../routes/(auth)/projects/[slug]/$types';
  import EditIcon from '@lucide/svelte/icons/settings';
  import EditProject from './EditProject.svelte';

  let state = $derived(page.data) as PageData;
  const dialog = useDialog();
</script>

<div class="flex items-center gap-2">
  <p class="text-lg font-semibold">{state.project.name}</p>
  <Button
    variant="ghost"
    size="icon"
    type="button"
    onclick={() =>
      dialog.open({
        title: 'Edit project',
        description: '',
        content: EditProject,
        contentProps: {}
      })}
  >
    <EditIcon class="text-muted-foreground size-4" />
  </Button>
</div>
