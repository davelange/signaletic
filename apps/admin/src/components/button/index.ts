import Button from './Button.svelte';
import { tv } from 'tailwind-variants';

const variants = {
  base: 'cursor-pointer ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default:
        'rounded-input bg-dark text-[15px] font-semibold text-background shadow-mini hover:bg-dark/95 active:scale-98 active:transition-all',
      outline: 'rounded-input border border-border-input bg-background'
    },
    size: {
      default: 'h-12 px-4 py-2'
    },
    fullWidth: {
      true: 'w-full',
      false: ''
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
} as const;

export const buttonVariants = tv(variants);

export type Variant = keyof typeof variants.variants.variant;
export type Size = keyof typeof variants.variants.size;
export { Button };
