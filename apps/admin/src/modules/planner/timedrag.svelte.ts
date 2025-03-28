import { dateToTime, timeToDate } from '$lib/utils';
import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';
import type { MouseEventHandler } from 'svelte/elements';
import { defaultTimeEges, type TimeEdges } from './planner.svelte';
import type { DisplayScene } from '$db/entities';

const MIN_BLOCK_HEIGHT = 2;

type ResizeHandle = 'top' | 'bottom';
type AdjustDir = 'up' | 'down';
type Block = {
  top: number;
  bottom: number;
  isResizing: boolean;
  resizeHandle?: ResizeHandle;
};

export class TimeDrag {
  blocks: Block[] = $state([]);
  scenes: DisplayScene[] = $state([]);
  timeEdges: TimeEdges = $state(defaultTimeEges);
  maxTimeSpan = $state(0);
  isDragging = false;
  activeBlockIdx = $state(-1);
  baseDate: CalendarDate = $state()!;
  displayId?: number;

  constructor({
    scenes,
    timeEdges,
    baseDate
  }: {
    scenes: DisplayScene[];
    timeEdges: { start: Time; end: Time };
    baseDate: CalendarDate;
  }) {
    this.scenes = [...scenes];
    this.displayId = scenes.at(0)?.displayId;
    this.baseDate = baseDate;

    this.updateTimeframe(timeEdges);
    this.updateScenes(scenes);
  }

  get activeBlock() {
    return this.blocks[this.activeBlockIdx];
  }

  set activeBlock(value: Block) {
    this.blocks[this.activeBlockIdx] = value;
  }

  scene(idx: number) {
    return this.scenes[idx];
  }

  updateTimeframe(timeEdges: { start: Time; end: Time }) {
    this.maxTimeSpan = timeEdges.end.compare(timeEdges.start);
    this.timeEdges = timeEdges;
  }

  updateScenes(scenes: DisplayScene[]) {
    this.scenes = [...scenes].sort((a, b) =>
      Math.sign(a.startsAt.getTime() - b.startsAt.getTime())
    );
  }

  createBlocks() {
    this.blocks = this.scenes.map((scene) => {
      const sceneToUse = scene;
      const sceneStartTime = dateToTime(sceneToUse.startsAt);
      const sceneDuration = dateToTime(sceneToUse.endsAt);
      const startDiff =
        (sceneStartTime.compare(this.timeEdges.start) * 100) / this.maxTimeSpan;
      const endDiff =
        (sceneDuration.compare(this.timeEdges.start) * 100) / this.maxTimeSpan;

      return {
        top: normalize(startDiff),
        bottom: normalize(100 - endDiff),
        isResizing: false
      };
    });
  }

  handleDragStart(blockIdx: number, resizeHandle: ResizeHandle) {
    this.isDragging = true;
    this.activeBlockIdx = blockIdx;
    this.blocks[blockIdx].isResizing = true;
    this.blocks[blockIdx].resizeHandle = resizeHandle;
  }

  getTimeFromPos(value: number) {
    return this.timeEdges.start.add({
      milliseconds: (value * this.maxTimeSpan) / 100
    });
  }

  updateSceneTimes() {
    this.scenes = this.scenes.map((scene, idx) => ({
      ...scene,
      startsAt: timeToDate(
        this.getTimeFromPos(this.blocks[idx].top),
        scene.startsAt
      ),
      endsAt: timeToDate(
        this.getTimeFromPos(invert(this.blocks[idx].bottom)),
        scene.endsAt
      )
    }));
  }

  updateSceneBaseDate(newCalDate: CalendarDate) {
    const newDate = newCalDate.toDate(getLocalTimeZone());
    this.baseDate = newCalDate;
    this.scenes = this.scenes.map((scene) => {
      scene.startsAt.setMonth(newDate.getMonth());
      scene.startsAt.setDate(newDate.getDate());
      scene.endsAt.setMonth(newDate.getMonth());
      scene.endsAt.setDate(newDate.getDate());

      return scene;
    });
    this.createBlocks();
  }

  handleDragEnd() {
    if (!this.isDragging) return;

    this.updateSceneTimes();

    this.isDragging = false;
    this.blocks[this.activeBlockIdx].isResizing = false;
    this.activeBlockIdx = -1;
  }

  handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!this.isDragging) return;

    const y = event.clientY - event.currentTarget.getBoundingClientRect().top;
    const yPoint = (y * 100) / event.currentTarget.offsetHeight;

    this.applyNewSize(yPoint);
  };

  applyNewSize(yPoint: number) {
    if (!this.activeBlock?.resizeHandle) return;

    if (this.activeBlock.resizeHandle === 'top') {
      const newBottom = Math.min(
        this.activeBlock.bottom,
        100 - (this.activeBlock.top + MIN_BLOCK_HEIGHT)
      );

      this.adjustSizes({
        ...this.activeBlock,
        top: normalize(yPoint),
        bottom: normalize(newBottom)
      });
    } else if (this.activeBlock.resizeHandle === 'bottom') {
      const newTop = Math.min(this.activeBlock.top, yPoint - MIN_BLOCK_HEIGHT);

      this.adjustSizes({
        ...this.activeBlock,
        top: normalize(newTop),
        bottom: normalize(100 - yPoint)
      });
    }
  }

  adjustSizes(newBlock: Block) {
    const safeStateUp = this.preventOverlaps(
      this.activeBlockIdx,
      [...this.blocks],
      newBlock,
      'up'
    );
    const safeStateDown = this.preventOverlaps(
      this.activeBlockIdx,
      safeStateUp,
      safeStateUp[this.activeBlockIdx],
      'down'
    );

    this.blocks = safeStateDown;
  }

  preventOverlaps(
    idx: number,
    state: Block[],
    newBlock: Block,
    dir: AdjustDir
  ): Block[] {
    const exitIdx = dir === 'up' ? 0 : state.length - 1;

    if (idx === exitIdx) {
      state[idx] = newBlock;
      return state;
    }

    const op = dir === 'up' ? -1 : 1;
    const next = state[idx + op];
    const overlap = this.collides(newBlock, next, dir);

    if (overlap > 0) {
      const nextBlockCanAdjust =
        invert(next.bottom) - next.top > MIN_BLOCK_HEIGHT;

      if (nextBlockCanAdjust) {
        if (dir === 'up') {
          next.bottom = normalize(next.bottom + overlap);
        } else {
          next.top = normalize(next.top + overlap);
        }
      } else {
        if (dir === 'up') {
          newBlock.top = normalize(invert(next.bottom));
        } else {
          newBlock.bottom = normalize(invert(next.top));
        }
      }
    }

    state[idx] = newBlock;

    return this.preventOverlaps(idx + op, state, next, dir);
  }

  collides(a: Block, b: Block, dir: AdjustDir) {
    if (dir === 'up') {
      return invert(b.bottom) - a.top;
    }

    return invert(a.bottom) - b.top;
  }
}

export function invert(val: number) {
  return Math.abs(val - 100);
}

function normalize(num: number) {
  return num;
  //return Math.round(num * 100) / 100;
}
