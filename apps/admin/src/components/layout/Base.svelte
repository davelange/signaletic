<script lang="ts">
  import type { Snippet } from '../../app';

  let {
    children,
    sidebar
  }: {
    children: Snippet;
    sidebar: Snippet;
  } = $props();
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
  <aside
    class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex"
  >
    <nav class="flex h-full flex-col items-center gap-4 px-2 sm:py-5">
      {@render sidebar()}
    </nav>
  </aside>

  <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
    <main
      class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
    >
      {@render children()}
    </main>
  </div>
</div>
