<script lang="ts">
  import { Button } from '$components/button';
  import { useDialog } from '$components/dialog/index.svelte';
  import EditIcon from '@lucide/svelte/icons/settings';
  import EditProject from './EditProject.svelte';

  const dialog = useDialog();
</script>

<div>
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
