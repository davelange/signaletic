import type { Component, Snippet } from 'svelte';
import DialogComponent, { type DialogComponentProps } from './Dialog.svelte';

export type DialogOptions = {
  content: Snippet;
  title: string;
  description: string;
};

class Dialog {
  isOpen = $state(false);

  options: DialogOptions | undefined;

  constructor(options?: DialogOptions) {
    if (options) {
      this.isOpen = true;
      this.options = options;
    }
  }

  open(options?: DialogOptions) {
    this.isOpen = true;

    if (options) {
      this.options = options;
    }
  }

  close() {
    this.isOpen = false;
  }

  get props(): DialogComponentProps {
    return {
      open: this.isOpen,
      onOpenChange: (val) => {
        this.isOpen = val;
      },
      options: this.options
    };
  }

  get Dialog() {
    return DialogComponent;
  }
}

export function useDialog(options?: DialogOptions) {
  return new Dialog(options);
}
