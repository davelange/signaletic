// See https://svelte.dev/docs/kit/types#app.d.ts

import type { scheduleEvent } from '$db/src/schema';
import type { InferSelectModel } from 'drizzle-orm';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      scheduleEvents: InferSelectModel<typeof scheduleEvent>[];
    }
    // interface PageState {}
    // interface Platform {}
  }

  namespace AppElements {
    type TagType = 'button' | 'a';
  }
}

export {};
