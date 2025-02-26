import { getContext, setContext } from 'svelte';
import type { Component, ComponentProps } from 'svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponent = Component<any>;

export type DialogOptions<T extends AnyComponent> = {
  content: T;
  contentProps: ComponentProps<T>;
  title: string;
  description: string;
};

export class Dialog {
  isOpen = $state(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options = $state<DialogOptions<any> | undefined>();

  open<T extends AnyComponent>(options: DialogOptions<T>) {
    this.isOpen = true;
    this.options = options;
  }

  close() {
    this.isOpen = false;
    this.options = undefined;
  }
}

const KEY = Symbol('Dialog');

export function initDialog() {
  return setContext(KEY, new Dialog());
}

export function useDialog() {
  return getContext<ReturnType<typeof initDialog>>(KEY);
}
