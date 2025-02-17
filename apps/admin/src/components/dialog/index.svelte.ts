import { setContext, type Snippet } from 'svelte';
import DialogComponent, { type DialogComponentProps } from './Dialog.svelte';

export type DialogOptions = {
  content: Snippet;
  title: string;
  description: string;
};

export class Dialog {
  isOpen = $state(false);
  id = $state();

  options: DialogOptions | undefined;

  constructor(id: string, options?: DialogOptions) {
    this.id = id;

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

export function useDialog(id: string, options?: DialogOptions) {
  const dialog = new Dialog(id, options);

  setContext(id, dialog);

  return dialog;
}
