<script lang="ts">
  import { resolve } from '$app/paths';

  import { formatMenuPriceLabel, getDisplayVariant } from '$lib/api/mappers';
  import { getMenuItemImage } from '$lib/content/menu';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { PublicMenuCategory, PublicMenuItem } from '$lib/api/types';

  let { item, category, categoryName } = $props<{
    item: PublicMenuItem;
    category?: Pick<PublicMenuCategory, 'slug' | 'nameEs'>;
    categoryName?: string;
  }>();

  const displayVariant = $derived(getDisplayVariant(item));
  const available = $derived(displayVariant?.available ?? false);
  const image = $derived(getMenuItemImage(item, category));
  const priceLabel = $derived(formatMenuPriceLabel(item));
</script>

<article class="menu-card">
  <div class="menu-card__media">
    <a
      class="menu-card__image-link"
      href={resolve('/carta/[slug]', { slug: item.slug })}
      aria-label={'Ver ' + item.nameEs}
    >
      <img class="menu-card__image" src={image} alt="" loading="lazy" />
    </a>
    {#if categoryName}
      <span class="menu-card__label"><Badge variant="info">{categoryName}</Badge></span>
    {/if}
    {#if available}
      <span class="menu-card__action">
        <Button href={resolve('/carta/[slug]', { slug: item.slug })} size="sm">Ver detalle</Button>
      </span>
    {:else}
      <span class="menu-card__stock"><Badge variant="secondary">No disponible</Badge></span>
    {/if}
  </div>

  <div class="menu-card__meta">
    <h3 class="menu-card__title">
      <a class="menu-card__title-link" href={resolve('/carta/[slug]', { slug: item.slug })}
        >{item.nameEs}</a
      >
    </h3>
    <p class="menu-card__price">{priceLabel}</p>
  </div>
</article>

<style>
  /* Catálogo plano: la foto lleva la categoría y la disponibilidad; el detalle vive en la ficha. */
  .menu-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    font-family: var(--font-family-menu);
    font-weight: var(--font-weight-light);
    letter-spacing: var(--letter-spacing-menu);
  }

  .menu-card__media {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--surface-warm);
  }

  .menu-card__image-link {
    display: block;
    block-size: 100%;
  }

  .menu-card__image {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    transition: transform var(--transition-base);
  }

  @media (hover: hover) {
    .menu-card:hover .menu-card__image,
    .menu-card:focus-within .menu-card__image {
      transform: scale(1.03);
    }
  }

  .menu-card__label,
  .menu-card__stock,
  .menu-card__action {
    position: absolute;
    z-index: 1;
  }

  .menu-card__label {
    inset-block-start: var(--space-sm);
    inset-inline-start: var(--space-sm);
  }

  .menu-card__stock,
  .menu-card__action {
    inset-inline: var(--space-sm);
    inset-block-end: var(--space-sm);
  }

  .menu-card__stock {
    pointer-events: none;
  }

  .menu-card__action {
    display: flex;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transform: translateY(0.35rem);
    transition:
      opacity var(--transition-fast),
      transform var(--transition-fast);
  }

  @media (hover: hover) {
    .menu-card:hover .menu-card__action,
    .menu-card:focus-within .menu-card__action {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
  }

  .menu-card__meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .menu-card__title {
    margin: 0;
    font-size: 1rem;
    font-weight: var(--font-weight-medium);
    letter-spacing: 0;
    line-height: 1.3;
  }

  .menu-card__title-link {
    color: inherit;
    text-decoration: none;
  }

  .menu-card__title-link:hover,
  .menu-card__title-link:focus-visible {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .menu-card__price {
    flex-shrink: 0;
    margin: 0;
    color: var(--foreground);
    font-size: var(--font-size-sm);
    line-height: 1.3;
    white-space: nowrap;
  }
</style>
