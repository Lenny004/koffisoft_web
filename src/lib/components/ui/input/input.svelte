<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', ...rest } = $props();
</script>

<input
  class={cn(
    'field-control flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
/>
