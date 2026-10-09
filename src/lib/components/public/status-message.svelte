<script lang="ts">
  import { Alert } from '$lib/components/ui/alert/index.js';

  let {
    title = 'Información',
    message,
    variant = 'default',
  } = $props<{
    title?: string;
    message: string;
    variant?: 'default' | 'destructive';
  }>();
</script>

<Alert class="status-message" {variant}>
  <p class="status-message__title">{title}</p>
  <p class="status-message__copy">{message}</p>
</Alert>

<style>
  /* Mensaje reutilizable para errores de red, configuración y estados vacíos. */
  :global(.status-message) {
    display: grid;
    gap: 0.25rem;
  }

  .status-message__title,
  .status-message__copy {
    margin: 0;
  }

  .status-message__title {
    font-weight: 700;
  }

  .status-message__copy {
    color: var(--muted-foreground);
  }
</style>
