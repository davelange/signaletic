<script lang="ts">
  import type { display, displayScene } from '$db/src/schema';
  import { colors, formatTime, getItemsInDay, msToHours } from '$lib/utils';
  import { CalendarDate, Time } from '@internationalized/date';
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
  let timeEdges = $state([new Time(8, 0), new Time(20, 0)]);

  let timeSpan = $derived(timeEdges[1].compare(timeEdges[0]));

  let timeRange = $derived.by(() => {
    let [start] = timeEdges;

    const minuteOffset = start.minute ? 60 - start.minute : 0;
    const diffInHrs = msToHours(timeSpan) + 1;
    const startPoint = start.add({ minutes: minuteOffset });

    return Array.from({ length: diffInHrs }).map((_o, idx) => {
      return startPoint.add({ hours: idx });
    });
  });

  function handleAddDay() {
    const lastDay = allDates.at(-1);
    if (!lastDay) return;
    allDates.push(lastDay.add({ days: 1 }));
  }

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

    const diff = msToHours(timeSpan);
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

    event.preventDefault();
  };

  function timeToPos(time: Time) {
    return (time.compare(timeEdges[0]) * 100) / timeSpan;
  }
</script>

<div class="relative mt-4 flex h-[80vh]">
  <div
    class="overflow-hidden border-r border-r-slate-200"
    onwheel={handleScroll}
  >
    <div class="h-full w-[76px]">
      {#each timeRange as item}
        <p class="absolute" style:top="{timeToPos(item)}%">
          {formatTime(item)}
        </p>
      {/each}
    </div>
  </div>
  <div class="relative flex flex-1" onwheel={handleDaysScroll}>
    <div class="absolute inset-0 overflow-hidden">
      <div class="h-full w-full">
        {#each timeRange as item}
          <div
            class="border-dark-10 absolute z-10 h-px w-full border-b border-dashed"
            style:top="{timeToPos(item)}%"
          ></div>
        {/each}
      </div>
    </div>

    {#each allDates as date}
      <div class="relative border-r border-slate-300">
        <div
          class="absolute top-4 w-full -translate-y-12 p-1 text-center text-sm font-medium"
        >
          {date.toString()}
        </div>
        <div class="relative flex h-full min-w-[200px]">
          {#each selectedDisplays as display}
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
