<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowRight, CircleCheck, CircleX } from '@lucide/svelte';

  import { formatMenuPrice, getDisplayVariant } from '$lib/api/mappers';
  import { getMenuItemImage } from '$lib/content/menu';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import type { PublicMenuCategory, PublicMenuItem } from '$lib/api/types';

  let {
    item,
    category,
    categoryName,
    featured = false,
  } = $props<{
    item: PublicMenuItem;
    category?: Pick<PublicMenuCategory, 'slug' | 'nameEs'>;
    categoryName?: string;
    featured?: boolean;
  }>();

  const displayVariant = $derived(getDisplayVariant(item));
  const image = $derived(getMenuItemImage(item, category));
</script>

<article class:menu-card--featured={featured} class="menu-card">
  <a
    class="menu-card__media"
    href={resolve('/carta/[slug]', { slug: item.slug })}
    aria-label={'Ver ' + item.nameEs}
  >
    <img src={image} alt="" loading="lazy" />
    {#if displayVariant}
      <span class="menu-card__status">
        {#if displayVariant.available}
          <CircleCheck size={15} aria-hidden="true" /> Disponible
        {:else}
          <CircleX size={15} aria-hidden="true" /> No disponible
        {/if}
      </span>
    {/if}
  </a>

  <div class="menu-card__body">
    <div class="menu-card__heading">
      <div>
        {#if categoryName}<p class="menu-card__category">{categoryName}</p>{/if}
        <h3 class="menu-card__title">
          <a href={resolve('/carta/[slug]', { slug: item.slug })}>{item.nameEs}</a>
        </h3>
      </div>
      {#if displayVariant}
        <Badge variant={displayVariant.available ? 'secondary' : 'outline'}>
          {displayVariant.available ? 'Disponible' : 'Agotado'}
        </Badge>
      {/if}
    </div>
    <p class="menu-card__description">
      {item.descriptionEs ?? 'Consulta los detalles de esta opción en nuestra carta.'}
    </p>
    <div class="menu-card__footer">
      <p class="menu-card__price">{formatMenuPrice(displayVariant)}</p>
      <a class="menu-card__link" href={resolve('/carta/[slug]', { slug: item.slug })}>
        Ver detalle <ArrowRight size={16} aria-hidden="true" />
      </a>
    </div>
  </div>
</article>

<style>
  /* Tarjeta pública con fotografía provisional y precio siempre derivado del contrato de la API. */
  .menu-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    block-size: 100%;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-base),
      box-shadow var(--transition-base);
  }

  .menu-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-0.25rem);
  }

  .menu-card--featured {
    border-color: color-mix(in oklab, var(--primary) 55%, var(--border));
  }

  .menu-card__media {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--surface-warm);
  }

  .menu-card__media img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    transition: transform var(--transition-base);
  }

  .menu-card:hover .menu-card__media img {
    transform: scale(1.04);
  }

  .menu-card__status {
    position: absolute;
    inset-block-start: var(--space-sm);
    inset-inline-start: var(--space-sm);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.55rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
    font-size: 0.72rem;
    font-weight: var(--font-weight-bold);
  }

  .menu-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
  }

  .menu-card__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .menu-card__category {
    margin: 0 0 var(--space-xs);
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .menu-card__title {
    margin: 0;
    font-size: 1.45rem;
  }

  .menu-card__title a {
    color: inherit;
    text-decoration: none;
  }

  .menu-card__description {
    flex: 1;
    margin: 0;
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .menu-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .menu-card__price {
    margin: 0;
    color: var(--primary);
    font-size: 1.1rem;
    font-weight: var(--font-weight-bold);
  }

  .menu-card__link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
  }
</style>
