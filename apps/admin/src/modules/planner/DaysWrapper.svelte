<script lang="ts">
  import type { display, displayScene } from '$db/src/schema';
  import {
    colors,
    getItemsInDay,
    msToHours,
    timeFromInput,
    timeToInput
  } from '$lib/utils';
  import { CalendarDate, DateFormatter, Time } from '@internationalized/date';
  import type { ChangeEventHandler } from 'svelte/elements';
  import DayList from './DayList.svelte';

  let {
    dates: initialDates,
    allDisplayScenes,
    projectId,
    selectedDisplays
  }: {
    dates: CalendarDate[];
    allDisplayScenes: (typeof displayScene.$inferSelect)[];
    projectId: number;
    selectedDisplays: (typeof display.$inferSelect)[];
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

  $inspect(timeRange);

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
    class="-my-[10px] flex flex-col justify-between border-r border-r-slate-200"
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
        <p>
          {item.hour.toString().padStart(2, '0')}:{item.minute
            .toString()
            .padStart(2, '0')}
        </p>
      {/if}
    {/each}
  </div>
  <div class="relative flex flex-1" onwheel={handleDaysScroll}>
    <div class="absolute inset-0 flex h-full w-full flex-col justify-between">
      {#each timeRange}
        <div
          class="border-dark-10 z-10 h-px w-full border-b border-dashed"
        ></div>
      {/each}
    </div>

    {#each allDates as date}
      <div class="relative border-r border-slate-300">
        <div
          class="absolute top-4 w-full -translate-y-12 p-1 text-center text-sm font-medium"
        >
          {date.toString()}
        </div>
        <div class="relative flex h-full min-w-[200px]">
          {#each selectedDisplays as display, idx}
            {@const list = getItemsInDay(
              allDisplayScenes.filter(
                (scene) => scene.displayId === display.id
              ),
              date
            )}
            {#if list.length}
              <DayList
                scenes={list}
                color={colors[display.id % colors.length]}
                {timeEdges}
                {projectId}
                baseDate={date}
              />
            {/if}
          {/each}
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
