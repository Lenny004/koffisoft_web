<script lang="ts">
  import { resolve } from '$app/paths';

  import { formatMenuPriceLabel, getDisplayVariant } from '$lib/api/mappers';
  import { getMenuItemImage } from '$lib/content/menu';
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
    {#if available}
      <span class="menu-card__veil" aria-hidden="true"></span>
      <a class="menu-card__action" href={resolve('/carta/[slug]', { slug: item.slug })}
        >Ver detalle</a
      >
    {:else}
      <p class="menu-card__stock">No disponible</p>
    {/if}
  </div>

  <div class="menu-card__meta">
    {#if categoryName}<p class="menu-card__label">{categoryName}</p>{/if}
    <h3 class="menu-card__title">
      <a class="menu-card__title-link" href={resolve('/carta/[slug]', { slug: item.slug })}
        >{item.nameEs}</a
      >
    </h3>
    <p class="menu-card__price">{priceLabel}</p>
  </div>
</article>

<style>
  /* Ficha plana: la foto ocupa el cuadro y el texto queda debajo, sin borde ni sombra. */
  .menu-card {
    display: flex;
    flex-direction: column;
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

  .menu-card__veil,
  .menu-card__action,
  .menu-card__stock {
    position: absolute;
  }

  .menu-card__veil {
    inset: 0;
    background: color-mix(in oklab, var(--background) 42%, transparent);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-fast);
  }

  .menu-card__action {
    inset: 50% auto auto 50%;
    padding: var(--space-xs) var(--space-sm);
    color: var(--foreground);
    font-size: 0.75rem;
    letter-spacing: var(--letter-spacing-label);
    text-decoration: underline;
    text-transform: uppercase;
    text-underline-offset: 0.3em;
    background: var(--background);
    transform: translate(-50%, -50%);
  }

  .menu-card__stock {
    inset-inline: var(--space-sm);
    inset-block-end: var(--space-sm);
    margin: 0;
    color: var(--foreground);
    font-size: 0.75rem;
    letter-spacing: var(--letter-spacing-label);
    text-align: center;
    text-transform: uppercase;
  }

  @media (hover: hover) {
    .menu-card__action {
      opacity: 0;
    }

    .menu-card:hover .menu-card__image,
    .menu-card:focus-within .menu-card__image {
      transform: scale(1.03);
    }

    .menu-card:hover .menu-card__veil,
    .menu-card:focus-within .menu-card__veil,
    .menu-card:hover .menu-card__action,
    .menu-card:focus-within .menu-card__action {
      opacity: 1;
    }
  }

  .menu-card__meta {
    display: grid;
    gap: 0.2rem;
    margin-block-start: var(--space-sm);
  }

  .menu-card__label,
  .menu-card__title,
  .menu-card__price {
    margin: 0;
  }

  .menu-card__label {
    color: var(--text-muted);
    font-size: 0.75rem;
    letter-spacing: var(--letter-spacing-label);
    text-transform: uppercase;
  }

  .menu-card__title {
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
    font-size: var(--font-size-sm);
    line-height: 1.3;
  }
</style>
