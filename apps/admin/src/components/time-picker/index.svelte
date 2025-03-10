<script lang="ts">
  import { Label } from 'bits-ui';
  import CalendarIcon from '@lucide/svelte/icons/clock';
  import { Button } from '$components/button';
  import clsx from 'clsx';

  type Props = {
    name: string;
    value: string;
    label?: string;
  };

  let { name, value = $bindable(), label }: Props = $props();
  let timeInputNode = $state<HTMLInputElement>();
</script>

<div class="relative w-[200px]">
  <input
    type="time"
    class="invisible absolute bottom-0 left-0"
    bind:this={timeInputNode}
    bind:value
    {name}
  />
  <Label.Root
    class="flex w-full flex-col space-y-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <p>{label}</p>
    <Button
      type="button"
      variant="outline"
      class={clsx(
        'justify-start text-left font-normal',
        !value && 'text-muted-foreground'
      )}
      onclick={() => {
        timeInputNode?.showPicker();
      }}
      fullWidth
    >
      <CalendarIcon class="mr-2 h-4 w-4  justify-self-start" />
      <div class="flex-1 px-2">
        {value ? value : 'Select a time'}
      </div>
    </Button>
  </Label.Root>
</div>
