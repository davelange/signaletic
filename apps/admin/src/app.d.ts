// See https://svelte.dev/docs/kit/types#app.d.ts

import type { template } from '$db/src/schema';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      templates: (typeof template.$inferSelect)[];
    }
    // interface PageState {}
    // interface Platform {}
  }

  namespace AppElements {
    type TagType = 'button' | 'a';
  }
}

export {};
