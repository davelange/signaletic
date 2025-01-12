<script lang="ts">
  import * as Breadcrumb from '$components/ui/breadcrumb/index.js';
  import ActionButton from '$components/ActionButton.svelte';
  import * as Tabs from '$components/ui/tabs';
  import Schedule from '$modules/schedule/Schedule.svelte';
  import AddDisplayForm from '$modules/displays/AddDisplayForm.svelte';
  import { Button } from '$components/ui/button';
  import { page } from '$app/state';

  let { data, children } = $props();
</script>

<header class="mb-10">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>{data.name}</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex justify-between">
    <h1 class="text-xl font-bold">{data.name}</h1>
    <ActionButton
      action={{ action: '?/deleteProject', id: data.slug }}
      variant="destructive"
      size="sm"
    >
      Delete
    </ActionButton>
  </div>
</header>

<Tabs.Root value={page.params.displayId != undefined ? 'displays' : 'schedule'}>
  <Tabs.List class="mb-4  grid w-[400px] grid-cols-2">
    <Tabs.Trigger value="schedule">Schedule</Tabs.Trigger>
    <Tabs.Trigger value="displays">Displays</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="schedule">
    <Schedule
      events={data.scheduleEvents || []}
      projectId={data.id.toString()}
    />
  </Tabs.Content>

  <Tabs.Content value="displays">
    <div class="mt-4 flex gap-10">
      <div class="bg-muted flex basis-[200px] flex-col gap-2 rounded-md p-4">
        {#each data.displays as display}
          <Button
            variant="link"
            class="text-bold w-full {page.params.displayId ==
            display.id.toString()
              ? 'font-bold'
              : ''}"
            href={`/projects/${data.slug}/displays/${display.id}`}
          >
            {display.name}
          </Button>
        {/each}
        <AddDisplayForm projectId={data.id.toString()} />
      </div>

      {#if !data.displays.length}
        <p class="mb-2 mt-6 text-sm text-gray-500">
          This project doesn't have any display yet
        </p>
      {/if}
      {@render children()}
    </div>
  </Tabs.Content>
</Tabs.Root>
