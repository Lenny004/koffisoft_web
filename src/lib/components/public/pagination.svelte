<script lang="ts">
  import { resolve } from '$app/paths';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  let {
    page = 1,
    totalPages = 1,
    baseHref,
  } = $props<{
    page?: number;
    totalPages?: number;
    baseHref: string;
  }>();

  const pageHref = (value: number) => (value === 1 ? baseHref : baseHref + '?page=' + value);
</script>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Paginación">
    <a
      class:pagination__link--disabled={page <= 1}
      class="pagination__link"
      href={resolve(page > 1 ? pageHref(page - 1) : pageHref(1))}
      aria-label="Página anterior"
      aria-disabled={page <= 1}
      tabindex={page <= 1 ? -1 : 0}
    >
      <ChevronLeft size={17} aria-hidden="true" />
    </a>
    <span class="pagination__status">Página {page} de {totalPages}</span>
    <a
      class:pagination__link--disabled={page >= totalPages}
      class="pagination__link"
      href={resolve(page < totalPages ? pageHref(page + 1) : pageHref(totalPages))}
      aria-label="Página siguiente"
      aria-disabled={page >= totalPages}
      tabindex={page >= totalPages ? -1 : 0}
    >
      <ChevronRight size={17} aria-hidden="true" />
    </a>
  </nav>
{/if}

<style>
  /* Navegación compacta con estado textual para no depender solo de iconos. */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    margin-block: var(--space-xl);
  }

  .pagination__link {
    display: inline-grid;
    place-items: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
    text-decoration: none;
  }

  .pagination__link--disabled {
    pointer-events: none;
    opacity: 0.45;
  }

  .pagination__status {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }
</style>
