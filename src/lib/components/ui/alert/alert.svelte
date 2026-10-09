<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', variant = 'default', children, ...rest } = $props();

  const classes = $derived(
    cn(
      'relative w-full rounded-lg border px-4 py-3 text-sm',
      variant === 'destructive'
        ? 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
        : 'border-border bg-card text-card-foreground',
      className,
    ),
  );
</script>

<div class={classes} role="alert" {...rest}>
  {@render children?.()}
</div>
