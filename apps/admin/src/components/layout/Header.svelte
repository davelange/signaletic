<script lang="ts">
  import * as Breadcrumb from '$components/breadcrumb';

  let { breadcrumbs }: { breadcrumbs: { label: string; href: string }[] } =
    $props();
</script>

<div class="col-span-3">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      {#each breadcrumbs as crumb}
        <Breadcrumb.Item>
          <Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
        </Breadcrumb.Item>
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>
