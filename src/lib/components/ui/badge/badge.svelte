<script lang="ts">
  import { cn } from '$lib/utils.js';

  let { class: className = '', variant = 'default', children, ...rest } = $props();

  const classes = $derived(
    cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
      variant === 'secondary'
        ? 'border-transparent bg-secondary text-secondary-foreground'
        : variant === 'outline'
          ? 'text-foreground'
          : 'border-transparent bg-primary text-primary-foreground',
      className,
    ),
  );
</script>

<span class={classes} {...rest}>{@render children?.()}</span>
