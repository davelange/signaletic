import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';

export const colors = [
  { light: '0 87% 90%', default: '0 98% 85%' },
  { light: '45 96% 85%', default: '50 97% 76%' },
  { light: '90 80% 88%', default: '90 83% 78%' },
  { light: '189 91% 88%', default: '189 92% 80%' }
];

export function generateSlug(name: string) {
  const rand = Math.random().toString(36).substring(2, 15);
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${rand}`;
}

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
  const values: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    switch (key) {
      case 'id':
      case 'projectId':
      case 'displayId':
      case 'scheduleEventId':
      case 'templateId':
        values[key] = value ? Number(value) : undefined;
        break;

      case 'startsAt':
      case 'endsAt':
        values[key] =
          typeof value === 'string' ? new Date(value) : new Date(Number(value));
        break;

      default:
        values[key] = value as string;
        break;
    }
  }

  return values as T;
}

export function getItemsInDay<T extends { startsAt: Date }>(
  items: T[],
  day: CalendarDate
) {
  const asDate = day.toDate(getLocalTimeZone());
  return items.filter(
    (event) =>
      event.startsAt.getDate() === asDate.getDate() &&
      event.startsAt.getMonth() === asDate.getMonth()
  );
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _omitted, ...rest } = obj;
  return rest;
}

export function formatCalendarDate(date: CalendarDate) {
  return calendarDateToDate(date).toLocaleDateString();
}

/* export const elementImages = [
  'https://alchemyconf.com/_next/static/media/remote_logo.6ce1ae6b.png',
  'https://alchemyconf.com/_next/static/media/erlang_logo.8e1d568c.svg',
  'https://alchemyconf.com/_next/static/media/maersk_logo.5b290f1a.png'
];
 */
