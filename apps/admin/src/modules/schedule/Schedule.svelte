<script lang="ts">
	import { enhance } from '$app/forms';
	import type { scheduleEvent } from '$db/src/schema';
	import type { InferSelectModel } from 'drizzle-orm';

	type Props = { events: InferSelectModel<typeof scheduleEvent>[]; projectId: string };

	let { events, projectId }: Props = $props();

	let eventDays = $state<Date[]>([new Date()]); //TODO: set initial value
	let activeDay = $state(0);
	let formInEdit = $state(-1);
	let eventsInDay = $derived(
		events.filter((event) => event.startsAt.getDate() === eventDays[activeDay].getDate())
	);

	let startsAtTime = $state('');
	let [hour, minute] = $derived(startsAtTime.split(':').map(Number));
	let startsAt = $derived(new Date(eventDays[activeDay])?.setHours(hour, minute));
</script>

<div>
	<h2>Schedule</h2>

	<div>
		{#each eventDays as day, idx}
			<button onclick={() => (activeDay = idx)}>{day.toDateString()}</button>
		{/each}
		<form
			action=""
			onsubmit={(e) => {
				e.preventDefault();
				eventDays.push(new Date(e.currentTarget.day.value));
				activeDay = eventDays.length - 1;
			}}
		>
			<input type="date" name="day" />
			<button type="submit">Add event day</button>
		</form>
	</div>

	{#each eventsInDay as event, idx}
		<div>
			{#if formInEdit === idx}
				<form method="post" action="?/editEvent" use:enhance>
					<label for="">
						Description
						<input name="description" type="text" value={event.description} />
					</label>
					<label for="">
						Starts at
						<input name="startsAtTime" type="time" bind:value={startsAtTime} />
					</label>
					<input name="startsAt" type="hidden" value={event.startsAt} />
					<input name="projectId" value={projectId} type="hidden" />
					<input name="id" value={event.id} type="hidden" />

					<button type="submit">Save</button>
				</form>
			{:else}
				<p>{event.description}</p>
				<p>starts at {event.startsAt.toLocaleTimeString()}</p>
			{/if}

			<form method="post" action="?/deleteEvent" use:enhance>
				<input name="id" value={event.id} type="hidden" />
				<button type="submit">Delete</button>
				<button type="button" onclick={() => (formInEdit = idx)}>Edit</button>
			</form>
		</div>
	{/each}

	{#if eventDays[activeDay]}
		<form method="post" action="?/addEvent" use:enhance>
			<label for="">
				Description
				<input name="description" type="text" placeholder="New event" />
			</label>
			<label for="">
				Starts at
				<input name="startsAtTime" type="time" bind:value={startsAtTime} />
			</label>
			<input name="startsAt" type="hidden" value={startsAt} />
			<input name="projectId" value={projectId} type="hidden" />

			<button type="submit">Add event</button>
		</form>
	{/if}
</div>
