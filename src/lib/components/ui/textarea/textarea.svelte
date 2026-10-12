<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', ...rest } = $props();
</script>

<textarea
  class={cn(
    'field-control flex min-h-24 w-full rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}></textarea>
