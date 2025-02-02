import type { displayScene } from '$db/src/schema';
import { dateToTime } from '$lib/utils';
import type { Time } from '@internationalized/date';
import type { MouseEventHandler } from 'svelte/elements';

const MIN_BLOCK_HEIGHT = 2;

type Scene = typeof displayScene.$inferSelect;
type ResizeHandle = 'top' | 'bottom';
type AdjustDir = 'up' | 'down';
type Block = {
  top: number;
  bottom: number;
  scene: Scene;
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

  constructor(scenes: Scene[], timeEdges: Time[]) {
    this.scenes = scenes;

    this.updateTimeframe(timeEdges);
  }

  get activeBlock() {
    return this.blocks[this.activeBlockIdx];
  }

  set activeBlock(value: Block) {
    this.blocks[this.activeBlockIdx] = value;
  }

  updateTimeframe(timeEdges: Time[]) {
    this.maxTimeSpan = timeEdges[1].compare(timeEdges[0]);
    this.timeEdges = timeEdges;

    this.createBlocks();
  }

  createBlocks() {
    this.blocks = this.scenes.map((scene) => {
      const sceneStartTime = dateToTime(scene.startsAt);
      const sceneDuration = dateToTime(scene.endsAt);
      const startDiff =
        (sceneStartTime.compare(this.timeEdges[0]) * 100) / this.maxTimeSpan;
      const endDiff =
        (sceneDuration.compare(this.timeEdges[0]) * 100) / this.maxTimeSpan;

      return {
        scene,
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

  handleDragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.blocks[this.activeBlockIdx].isResizing = false;
    this.activeBlockIdx = -1;
    // mutate
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
    console.log(overlap);

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
          newBlock.top = normalize(invert(next.bottom) - overlap);
        } else {
          newBlock.bottom = normalize(invert(next.top) - overlap);
        }
      }
    }

    state[idx] = newBlock;

    return this.preventOverlaps(idx + op, state, next, dir);
  }

  collides(a: Block, b: Block, dir: AdjustDir) {
    if (dir === 'up') {
      //return a.top <= invert(b.bottom);
      return invert(b.bottom) - a.top;
    }

    //return invert(a.bottom) >= b.top;
    return invert(a.bottom) - b.top;
  }
}

function invert(val: number) {
  return Math.abs(val - 100);
}

function normalize(num: number) {
  return Math.round(num * 100) / 100;
}
