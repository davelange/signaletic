import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { CalendarDate, Time } from '@internationalized/date';

export const colors = [
  { light: '0 87% 90%', default: '0 98% 85%' },
  { light: '45 96% 85%', default: '50 97% 76%' },
  { light: '90 80% 88%', default: '90 83% 78%' },
  { light: '189 91% 88%', default: '189 92% 80%' }
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number]
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, '');
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};

export function getEventDays<T extends { startsAt: Date }>(events: T[]) {
  return events
    .map((item) => {
      const d = new Date(item.startsAt);
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d.getTime();
    })
    .filter((item, idx, arr) => arr.indexOf(item) === idx)
    .map((a) => new Date(a))
    .sort((a, b) => (a > b ? 1 : -1));
}

export function getFormValues<T>(formData: FormData) {
  const values: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value as string;
  }

  return values as T;
}

export function getItemsInDay<T extends { startsAt: Date }>(
  items: T[],
  day: CalendarDate
) {
  return items.filter((event) => event.startsAt.getDate() === day.day);
}

export function toTimeInput(date?: Date) {
  if (!date) return '';

  const pad = (val: number) => val.toString().padStart(2, '0');

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function timeToInput(time: Time) {
  const pad = (val: number) => val.toString().padStart(2, '0');

  return `${pad(time.hour)}:${pad(time.minute)}`;
}

export function timeFromInput(input: string) {
  const [hour, minute] = input.split(':');

  return new Time(Number(hour), Number(minute));
}

export function formatStartTime(value: Date) {
  return `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`;
}

export function dateToCalendarDate(value: Date) {
  return new CalendarDate(
    value.getFullYear(),
    value.getMonth() + 1,
    value.getDate()
  );
}

export function calendarDateToDate(value: CalendarDate) {
  return new Date(value.year, value.month - 1, value.day);
}

export function dateToTime(value: Date) {
  return new Time(value.getHours(), value.getMinutes(), value.getSeconds());
}

export function msToHours(val: number) {
  return val / 1000 / 60 / 60;
}

export function timeToDate(time: Time, baseDate: Date) {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    time.hour,
    time.minute,
    time.second
  );
}

export function formatTime(time: Time) {
  if (!time) return '';
  return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
}

export function toHsl(vals: string, alpha = 1) {
  return `hsl(${vals} / ${alpha})`;
}
