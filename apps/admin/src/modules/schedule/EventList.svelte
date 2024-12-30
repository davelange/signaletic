<script lang="ts">
  import TrashIcon from 'lucide-svelte/icons/trash';
  import EditIcon from 'lucide-svelte/icons/pencil';
  import type { scheduleEvent } from '$db/src/schema';
  import type { InferSelectModel } from 'drizzle-orm';
  import EventForm from './EventForm.svelte';
  import ActionButton from '$components/ActionButton.svelte';
  import Button from '$components/ui/button/button.svelte';
  import EditEventForm from './EditEventForm.svelte';

  type Props = {
    projectId: string;
    events: InferSelectModel<typeof scheduleEvent>[];
    day: Date;
  };

  let { events, day, projectId }: Props = $props();
  let formInEdit = $state(-1);
  let eventsInDay = $derived(
    events.filter((event) => event.startsAt.getDate() === day.getDate())
  );

  function formatStartTime(value: Date) {
    return `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`;
  }
</script>

<div class="mb-3 flex flex-col gap-2">
  {#if !eventsInDay.length}
    <p class="mb-4 text-sm text-slate-600">No events on this day yet</p>
  {:else}
    {#each eventsInDay as event, idx}
      {@const showEdit = formInEdit === idx}
      <div
        class="relative rounded-sm border px-4 py-2"
        class:border-indigo-600={showEdit}
        class:bg-indigo-600={!showEdit}
      >
        {#if showEdit}
          <EditEventForm
            baseDate={day}
            close={() => (formInEdit = -1)}
            {event}
          />
        {:else}
          <div class="grid grid-rows-2 items-center text-slate-100">
            <p class="text-sm">
              {formatStartTime(event.startsAt)}
            </p>
            <div class="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onclick={() => (formInEdit = idx)}
              >
                <EditIcon size={16} />
              </Button>
              <ActionButton
                action={{ action: '?/deleteEvent', id: event.id }}
                variant="ghost"
                size="sm"
              >
                <TrashIcon size={16} />
              </ActionButton>
            </div>

            <p class="col-span-2 font-bold">{event.description}</p>
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>

<EventForm prompt {projectId} baseDate={day} />
