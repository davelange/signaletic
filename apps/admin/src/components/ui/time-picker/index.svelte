<script lang="ts">
  import CalendarIcon from 'lucide-svelte/icons/clock';
  import { cn } from '$lib/utils.js';
  import { Button } from '$components/ui/button';

  type Props = {
    name: string;
    value: string;
  };

  let { name, value = $bindable() }: Props = $props();
  let timeInputNode = $state<HTMLInputElement>();
</script>

<div class="relative">
  <input
    type="time"
    class="invisible absolute left-0 bottom-0"
    bind:this={timeInputNode}
    bind:value
    {name}
  />
  <Button
    variant="outline"
    class={cn(
      'w-[180px] justify-start text-left font-normal',
      !value && 'text-muted-foreground'
    )}
    size="sm"
    onclick={() => {
      timeInputNode?.showPicker();
    }}
  >
    <CalendarIcon class="mr-2 h-4 w-4" />
    {value ? value : 'Select a time'}
  </Button>
</div>
