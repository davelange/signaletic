// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    //interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace AppElements {
    type TagType = 'button' | 'a';
  }
}

export type Snippet = () => ReturnType<import('svelte').Snippet>;

export type DisplaySceneElement = {
  src: string
  width: number
  height: number
  x: number
  y: number
}