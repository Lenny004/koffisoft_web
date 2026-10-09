<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', children, ...rest } = $props();
</script>

<div class={cn('flex flex-col space-y-1.5 pr-8 text-left', className)} {...rest}>
  {@render children?.()}
</div>
