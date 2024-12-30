<script lang="ts">
  import { DatePicker } from '$components/ui/date-picker/index';

  type Props = {
    onSubmit: (value: Date) => void;
  };

  let { onSubmit }: Props = $props();
</script>

<label class="h-fit">
  <p class="mb-1 text-sm text-slate-500">Add day</p>
  <DatePicker
    onChange={(val) => {
      if (val) {
        onSubmit(new Date(val.toString()));
      }
    }}
  />
</label>
