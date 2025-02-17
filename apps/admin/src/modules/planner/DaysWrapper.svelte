<script lang="ts">
  import type { displayScene } from '$db/src/schema';
  import {
    getItemsInDay,
    msToHours,
    timeFromInput,
    timeToInput
  } from '$lib/utils';
  import { CalendarDate, Time } from '@internationalized/date';
  import type { ChangeEventHandler } from 'svelte/elements';
  import DayList from './DayList.svelte';

  let {
    dates: initialDates,
    allDisplayScenes,
    projectId
  }: {
    dates: CalendarDate[];
    allDisplayScenes: (typeof displayScene.$inferSelect)[];
    projectId: number;
  } = $props();

  let allDates = $state(initialDates);
  let timeEdges = $state<Time[]>([new Time(8, 0), new Time(20, 0)]);

  let timeRange = $derived.by(() => {
    let [start, end] = timeEdges;

    const diffInHrs = msToHours(end.compare(start)) + 1;
    const startPoint = start.minute
      ? start.add({ minutes: 60 - start.minute })
      : start;

    return Array.from({ length: diffInHrs }).map((_o, idx) => {
      return startPoint.add({ hours: idx });
    });
  });

  function handleAddDay() {
    const lastDay = allDates.at(-1);
    if (!lastDay) return;
    allDates.push(lastDay.add({ days: 1 }));
  }

  const handleTimeEdgeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { value, name } = event.currentTarget;
    const time = timeFromInput(value);

    if (name === 'start' && time.hour < timeEdges[1].hour) {
      timeEdges[0] = time;
    } else if (name === 'end' && time.hour > timeEdges[0].hour) {
      timeEdges[1] = time;
    }
  };

  const handleDaysScroll = (event: WheelEvent) => {
    const down = event.deltaY < 0;
    const op = down ? 'add' : 'subtract';

    timeEdges[0] = timeEdges[0][op]({
      minutes: 10
    });
    timeEdges[1] = timeEdges[1][op]({
      minutes: 10
    });
  };

  const handleScroll = (
    event: WheelEvent & { currentTarget: HTMLDivElement }
  ) => {
    if (!event.currentTarget) return;

    const diff = msToHours(timeEdges[1].compare(timeEdges[0]));
    const unit = 5;

    const down = event.deltaY < 0;
    const { top, height } = event.currentTarget.getBoundingClientRect();
    const y = event.clientY - top;
    const yRelative = y / height;

    if (down) {
      if (diff <= 1) return;

      timeEdges[0] = timeEdges[0].add({
        minutes: Math.round(unit * yRelative)
      });
      timeEdges[1] = timeEdges[1].subtract({
        minutes: Math.round(unit * (1 - yRelative))
      });
    } else {
      if (diff >= 24) return;

      timeEdges[0] = timeEdges[0].subtract({
        minutes: Math.round(unit * yRelative)
      });
      timeEdges[1] = timeEdges[1].add({
        minutes: Math.round(unit * (1 - yRelative))
      });
    }
  };
</script>

<div class="relative flex h-[90vh]">
  <div
    class="flex flex-col justify-between border-r border-r-slate-200"
    onwheel={handleScroll}
  >
    {#each timeRange as item, idx}
      {#if idx === 0}
        <input
          name="start"
          type="time"
          value={timeToInput(item)}
          onchange={handleTimeEdgeChange}
        />
      {:else if idx === timeRange.length - 1}
        <input
          name="end"
          type="time"
          value={timeToInput(item)}
          onchange={handleTimeEdgeChange}
        />
      {:else}
        <p>{item.toString()}</p>
      {/if}
    {/each}
  </div>
  <div class="relative flex flex-1 gap-4" onwheel={handleDaysScroll}>
    <div class="overlay">
      {#each timeRange}
        <div class="time-line"></div>
      {/each}
    </div>

    {#each allDates as date}
      <div class="relative">
        <div
          class="absolute top-4 w-full -translate-y-12 p-1 text-center text-sm font-medium"
        >
          {date.toString()}
        </div>
        <div class="relative h-full min-w-[200px] border-r border-slate-200">
          <DayList
            scenes={getItemsInDay(allDisplayScenes, date)}
            {timeEdges}
            {projectId}
            baseDate={date}
          />
        </div>
      </div>
    {/each}
  </div>

  <div>
    <button type="button" onclick={handleAddDay} disabled={!allDates.length}>
      Add day
    </button>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & .time-line {
      height: 1px;
      background: #ddd;
      width: 100%;
    }
  }
</style>
