import { toTimeInput } from '$lib/utils';

type Options = { baseDate?: Date; defaultValue?: Date };

class TimePickerContruct {
  baseDate = new Date();
  inputValue = $state('');
  timeParts = $derived(this.inputValue.split(':').map(Number));
  dateValue = $derived(
    new Date(this.baseDate)?.setHours(this.timeParts?.[0], this.timeParts?.[1])
  );

  setTime(value: Date) {
    this.inputValue = toTimeInput(value);
  }

  constructor(options?: Options) {
    this.baseDate = options?.baseDate || new Date();

    if (options?.defaultValue) {
      this.inputValue = toTimeInput(options.defaultValue);
    }
  }
}

export function useTimePicker(options?: Options) {
  return new TimePickerContruct(options);
}
