<script lang="ts">
  import { Input } from '$components/input';
</script>

<div>
  <h1>Add new project</h1>

  <form method="post">
    <Input type="text" id="name" name="name" label="Name" />
    <button type="submit">Create</button>
  </form>
</div>
