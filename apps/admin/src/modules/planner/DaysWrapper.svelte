<script lang="ts">
  import { colors, formatTime, getItemsInDay, msToHours } from '$lib/utils';
  import { Time } from '@internationalized/date';
  import DayList from './DayList.svelte';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { getPlannerState } from './planner.svelte';
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$components/button';
  import { useMutation } from '$lib/api.svelte';
  import { displaySceneRepo } from '$db/lib';
  import type { DisplayScene } from '$db/entities';

  const planner = getPlannerState();

  const saveMutation = useMutation({
    fn: (items: DisplayScene[]) => {
      return Promise.all(
        items.map(async (item) => await displaySceneRepo.update(item.id, item))
      );
    },
    onSuccess: async () => await invalidateAll()
  });

  let timeSpan = $derived(
    planner.timeEdges.end.compare(planner.timeEdges.start)
  );

  let timeRange = $derived.by(() => {
    const minuteOffset = planner.timeEdges.start.minute
      ? 60 - planner.timeEdges.start.minute
      : 0;
    const diffInHrs = msToHours(timeSpan) + 1;
    const startPoint = planner.timeEdges.start.add({ minutes: minuteOffset });

    return Array.from({ length: diffInHrs }).map((_o, idx) => {
      return startPoint.add({ hours: idx });
    });
  });

  function handleAddDay() {
    const lastDay = planner.dates.at(-1);

    if (!lastDay) return;

    planner.dates.push(lastDay.add({ days: 1 }));
  }

  const handleDaysScroll = (event: WheelEvent) => {
    const down = event.deltaY < 0;
    const op = down ? 'add' : 'subtract';

    const nextStart = planner.timeEdges.start[op]({
      minutes: 10
    });
    const nextEnd = planner.timeEdges.end[op]({
      minutes: 10
    });

    if (
      (nextStart.hour === 0 && nextStart.minute === 0) ||
      (nextEnd.hour === 23 && nextEnd.minute == 50)
    ) {
      return;
    }

    planner.timeEdges.start = nextStart;
    planner.timeEdges.end = nextEnd;
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

      planner.timeEdges.start = planner.timeEdges.start.add({
        minutes: Math.round(unit * yRelative)
      });
      planner.timeEdges.end = planner.timeEdges.end.subtract({
        minutes: Math.round(unit * (1 - yRelative))
      });
    } else {
      if (diff >= 24) return;

      planner.timeEdges.start = planner.timeEdges.start.subtract({
        minutes: Math.round(unit * yRelative)
      });
      planner.timeEdges.end = planner.timeEdges.end.add({
        minutes: Math.round(unit * (1 - yRelative))
      });
    }

    event.preventDefault();
  };

  function timeToPos(time: Time) {
    return (time.compare(planner.timeEdges.start) * 100) / timeSpan;
  }
</script>

<div class="relative mt-4 flex h-[80vh]">
  <div
    onwheel={handleScroll}
    class="relative flex-shrink-0 basis-[70px] overflow-hidden"
  >
    {#each timeRange as item}
      <p
        class="absolute -translate-y-[10px] text-sm font-medium"
        style:top="{timeToPos(item)}%"
      >
        {formatTime(item)}
      </p>
    {/each}
  </div>
  <div
    class="relative flex flex-1 border border-dashed"
    onwheel={handleDaysScroll}
  >
    <div class="absolute inset-0 overflow-hidden">
      <div class="h-full w-full">
        {#each timeRange as item}
          <div
            class="border-dark-10 absolute h-px w-full border-b border-dashed"
            style:top="{timeToPos(item)}%"
          ></div>
        {/each}
      </div>
    </div>

    {#each planner.dates as date}
      <div class="relative border-r border-slate-300">
        <div
          class="absolute top-4 w-full -translate-y-12 p-1 text-center text-sm font-medium"
        >
          {date.toString()}
        </div>
        <div class="relative flex h-full min-w-[220px]">
          {#each planner.selectedDisplays as display}
            {@const list = getItemsInDay(display.scheduledScenes(), date)}
            <DayList
              scenes={list}
              color={colors[display.id % colors.length]}
              baseDate={date}
              displayId={display.id}
            />
          {/each}
        </div>
      </div>
    {/each}
    <div class="relative flex w-[200px] justify-center">
      <Button
        size="sm"
        variant="ghost"
        class="absolute -translate-y-[100%]"
        onclick={handleAddDay}
      >
        Add day
        <PlusIcon class="ml-2 size-3" />
      </Button>
    </div>
  </div>
</div>
<div class="fixed bottom-[3%] right-[5%] shadow-lg">
  <Button
    type="button"
    variant="default"
    onclick={async () => {
      await saveMutation.mutate(
        planner.getAllTimeDragScenes() as DisplayScene[]
      );
    }}
    disabled={saveMutation.isPending}
    isLoading={saveMutation.isPending}
  >
    Save changes
  </Button>
</div>
