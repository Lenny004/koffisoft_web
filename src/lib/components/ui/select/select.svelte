<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', children, ...rest } = $props();
</script>

<select
  class={cn(
    'flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</select>
