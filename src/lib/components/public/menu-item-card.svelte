<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';

  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import { formatMenuPrice, getDisplayVariant } from '$lib/api/mappers';
  import type { PublicMenuItem } from '$lib/api/types';
  import { cn } from '$lib/utils.js';

  let {
    item,
    categoryName,
    featured = false,
  } = $props<{
    item: PublicMenuItem;
    categoryName?: string;
    featured?: boolean;
  }>();

  const displayVariant = $derived(getDisplayVariant(item));
</script>

<Card class={cn('menu-card', featured && 'menu-card--featured')}>
  <CardHeader class="menu-card__header">
    <div class="menu-card__heading">
      {#if categoryName}
        <p class="menu-card__category">{categoryName}</p>
      {/if}
      <CardTitle class="menu-card__title">{item.nameEs}</CardTitle>
    </div>
    {#if displayVariant}
      <Badge variant={displayVariant.available ? 'secondary' : 'outline'}>
        {displayVariant.available ? 'Disponible' : 'No disponible'}
      </Badge>
    {/if}
  </CardHeader>

  <CardContent class="menu-card__content">
    <p class="menu-card__description">
      {item.descriptionEs ?? 'Consulta los detalles de esta opción en nuestra carta.'}
    </p>
    <div class="menu-card__footer">
      <p class="menu-card__price">{formatMenuPrice(displayVariant)}</p>
      <Button variant="link" href={`/carta/${item.slug}`} class="menu-card__link">
        Ver detalle
        <ArrowRight class="menu-card__icon" size={16} aria-hidden="true" />
      </Button>
    </div>
  </CardContent>
</Card>

<style>
  /* Bloque de presentación de un ítem público; el precio siempre proviene del DTO de la API. */
  :global(.menu-card) {
    block-size: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :global(.menu-card__header) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .menu-card__heading {
    min-inline-size: 0;
  }

  .menu-card__category {
    margin: 0 0 0.35rem;
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  :global(.menu-card__title) {
    font-family: Georgia, serif;
    font-size: 1.25rem;
  }

  :global(.menu-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .menu-card__description {
    flex: 1;
    margin: 0;
    color: var(--muted-foreground);
    font-size: 0.95rem;
  }

  .menu-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .menu-card__price {
    margin: 0;
    color: var(--foreground);
    font-weight: 700;
  }

  :global(.menu-card__link) {
    padding-inline: 0;
  }

  :global(.menu-card__icon) {
    margin-inline-start: 0.3rem;
  }

  :global(.menu-card--featured) {
    border-color: var(--primary);
  }
</style>
