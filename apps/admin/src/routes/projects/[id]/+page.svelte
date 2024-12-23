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

<Tabs.Root value="account">
  <Tabs.List class="grid  grid-cols-2 w-[400px]">
    <Tabs.Trigger value="account">Schedule</Tabs.Trigger>
    <Tabs.Trigger value="password">Displays</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <Schedule
      events={data.scheduleEvents || []}
      projectId={data.id.toString()}
    />
  </Tabs.Content>
</Tabs.Root>
