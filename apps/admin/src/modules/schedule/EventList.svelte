<script lang="ts">
  import TrashIcon from 'lucide-svelte/icons/trash';
  import EditIcon from 'lucide-svelte/icons/pencil';
  import type { scheduleEvent } from '$db/src/schema';
  import { type InferSelectModel } from 'drizzle-orm';
  import EventForm from './EventForm.svelte';
  import ActionButton from '$components/ActionButton.svelte';
  import Button from '$components/ui/button/button.svelte';
  import EditEventForm from './EditEventForm.svelte';
  import { formatStartTime, getItemsInDay } from '$lib/utils';
  import DialogForm from '$components/DialogForm.svelte';

  type Props = {
    projectId: string;
    events: InferSelectModel<typeof scheduleEvent>[];
    day: Date;
  };

  let { events, day, projectId }: Props = $props();

  let eventsInDay = $derived(getItemsInDay(events, day));

  let eventInEdit: Props['events'][number] | undefined = $state();
  let dialogForm: DialogForm | undefined = $state();
</script>

<div class="mb-3 flex flex-col gap-2">
  {#if !eventsInDay.length}
    <p class="mb-4 text-sm text-slate-600">No events on this day yet</p>
  {:else}
    {#each eventsInDay as event}
      <div class="relative rounded-sm border bg-indigo-600 px-4 py-2">
        <div class="grid grid-rows-2 items-center text-slate-100">
          <p class="text-sm">
            {formatStartTime(event.startsAt)}
          </p>
          <div class="ml-auto flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onclick={() => {
                eventInEdit = event;
                dialogForm?.toggleDialog();
              }}
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
      </div>
    {/each}

    <DialogForm
      bind:this={dialogForm}
      title="Edit event"
      submitButtonText="Confirm"
      method="post"
      action={`/projects/${projectId}?/editEvent`}
      class="flex flex-col gap-4"
    >
      <EditEventForm baseDate={day} event={eventInEdit} />
    </DialogForm>
  {/if}
</div>

<EventForm prompt {projectId} baseDate={day} />
