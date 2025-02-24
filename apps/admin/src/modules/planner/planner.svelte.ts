//import type { DB } from '$db/lib';
import { getContext, setContext } from 'svelte';
import type { PageData } from '../../routes/projects/[slug]/$types';
import { dateToCalendarDate, getEventDays } from '$lib/utils';
import { CalendarDate, Time } from '@internationalized/date';
import { TimeDrag } from './timedrag.svelte';
import type { DisplayScene } from '$db/entities/DisplayScene';

type PlannerProps = {
  data: PageData['project'];
};

export type TimeEdges = { start: Time; end: Time };
export const defaultTimeEges = {
  start: new Time(8, 0),
  end: new Time(20, 0)
};

class Planner {
  data: PlannerProps['data'] = $state() as PlannerProps['data'];
  selectedDisplayIds: number[] = $state([]);
  dates: CalendarDate[] = $state([]);
  timeEdges: TimeEdges = $state(defaultTimeEges);
  timeDrags: Record<string, TimeDrag> = {};

  constructor(props: PlannerProps) {
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

  allDisplays = $derived(this.project.displays);
  scenes = $derived(this.project.displays.flatMap((d) => d.displayScenes));
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

  addTimeDrag(
    scenes: DisplayScene[],
    baseDate: CalendarDate,
    displayId: number
  ) {
    const key = `${baseDate.toString()}_${displayId}`;
    const timeDrag = new TimeDrag({
      scenes,
      timeEdges: this.timeEdges,
      baseDate
    });
    this.timeDrags[key] = timeDrag;

    return this.timeDrags[key];
  }

  getAllTimeDragScenes() {
    return Object.values(this.timeDrags).flatMap((item) => item.scenes);
  }
}

const PLANNER_KEY = Symbol('PLANNER');

export function setPlannerState(props: PlannerProps) {
  return setContext(PLANNER_KEY, new Planner(props));
}

export function getPlannerState() {
  return getContext<ReturnType<typeof setPlannerState>>(PLANNER_KEY);
}
