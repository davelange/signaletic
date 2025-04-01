//import type { DB } from '$db/lib';
import { getContext, setContext } from 'svelte';
import type { PageData } from '../../routes/(auth)/projects/[slug]/$types';
import { dateToCalendarDate, getEventDays } from '$lib/utils';
import { CalendarDate, Time } from '@internationalized/date';
import { TimeDrag } from './timedrag.svelte';
import type { DisplayScene } from '$db/entities/DisplayScene';

type PlannerProps = {
  data: PageData['project'];
};

export type TimeEdges = { start: Time; end: Time };
export const defaultTimeEges = {
  start: new Time(9, 0),
  end: new Time(18, 0)
};

class Planner {
  data: PlannerProps['data'] = $state() as PlannerProps['data'];
  selectedDisplayIds: number[] = $state([]);
  dates: CalendarDate[] = $state([]);
  timeEdges: TimeEdges = $state(defaultTimeEges);
  timeDrags: Record<string, TimeDrag> = {};

  init(props: PlannerProps) {
    this.data = props.data;
    this.dates = getEventDays(this.scenes).map(dateToCalendarDate);
    this.selectedDisplayIds = this.data.displays.map((item) => item.id);
  }

  get project() {
    return (
      this.data || {
        displays: []
      }
    );
  }

  updateDay(oldDate: CalendarDate, newDate: CalendarDate) {
    this.dates = this.dates.map((item) =>
      !item.compare(oldDate) ? newDate : item
    );
  }

  allDisplays = $derived(this.project.displays);
  scenes = $derived(this.project.displays.flatMap((d) => d.scheduledScenes()));
  selectedDisplays = $derived(
    this.allDisplays.filter((item) => this.selectedDisplayIds.includes(item.id))
  );
  selectedDisplayScenes = $derived(
    this.scenes.filter((item) =>
      this.selectedDisplayIds.includes(item.displayId)
    )
  );

  toggleDisplay(id: number) {
    if (this.selectedDisplayIds.includes(id)) {
      this.selectedDisplayIds = this.selectedDisplayIds.filter(
        (item) => item !== id
      );
    } else {
      this.selectedDisplayIds.push(id);
    }
  }

  registryKey = 0;

  addTimeDrag(
    scenes: DisplayScene[],
    baseDate: CalendarDate,
    displayId: number
  ) {
    const key = `${this.registryKey}_${displayId}`;
    const timeDrag = new TimeDrag({
      scenes,
      timeEdges: this.timeEdges,
      baseDate
    });
    this.timeDrags[key] = timeDrag;
    this.registryKey++;

    return key;
  }

  getAllTimeDragScenes() {
    return Object.values(this.timeDrags).flatMap((item) =>
      $state.snapshot(item.scenes)
    );
  }
}

const PLANNER_KEY = Symbol('PLANNER');

export function initPlanner() {
  return setContext(PLANNER_KEY, new Planner());
}

export function getPlannerState() {
  return getContext<ReturnType<typeof initPlanner>>(PLANNER_KEY);
}

export function setPlannerState(props: PlannerProps) {
  const planner = getPlannerState();
  planner.init(props);
  return planner;
}
