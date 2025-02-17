import type { displayScene } from '$db/src/schema';
import { dateToTime, timeToDate } from '$lib/utils';
import { CalendarDate, Time } from '@internationalized/date';
import type { MouseEventHandler } from 'svelte/elements';

const MIN_BLOCK_HEIGHT = 2;

type Scene = typeof displayScene.$inferSelect;
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
  scenes: Scene[] = $state([]);
  timeEdges: Time[] = $state([]);
  maxTimeSpan = 0;
  isDragging = false;
  activeBlockIdx = $state(-1);
  baseDate: CalendarDate;
  displayId?: number;

  constructor({
    scenes,
    timeEdges,
    baseDate
  }: {
    scenes: Scene[];
    timeEdges: Time[];
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

  updateTimeframe(timeEdges: Time[]) {
    this.maxTimeSpan = timeEdges[1].compare(timeEdges[0]);
    this.timeEdges = timeEdges;
  }

  updateScenes(scenes: Scene[]) {
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
        (sceneStartTime.compare(this.timeEdges[0]) * 100) / this.maxTimeSpan;
      const endDiff =
        (sceneDuration.compare(this.timeEdges[0]) * 100) / this.maxTimeSpan;

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
    return this.timeEdges[0].add({
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

function invert(val: number) {
  return Math.abs(val - 100);
}

function normalize(num: number) {
  return Math.round(num * 100) / 100;
}
