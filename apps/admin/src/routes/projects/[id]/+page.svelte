<script lang="ts">
  import * as Breadcrumb from '$components/ui/breadcrumb/index.js';
  import ActionButton from '$components/ActionButton.svelte';
  import * as Tabs from '$components/ui/tabs';
  import Schedule from '$modules/schedule/Schedule.svelte';

  let { data } = $props();
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

<Tabs.Root>
  <Tabs.List class="grid  w-[400px] grid-cols-2">
    <Tabs.Trigger value="schedule">Schedule</Tabs.Trigger>
    <Tabs.Trigger value="displays">Displays</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="schedule">
    <Schedule
      events={data.scheduleEvents || []}
      projectId={data.id.toString()}
    />
  </Tabs.Content>
  <Tabs.Content value="displays">dispaltys</Tabs.Content>
</Tabs.Root>
