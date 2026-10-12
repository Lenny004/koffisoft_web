<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', children, ...rest } = $props();
</script>

<select
  class={cn(
    'field-control flex h-10 w-full appearance-none rounded-md bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</select>
