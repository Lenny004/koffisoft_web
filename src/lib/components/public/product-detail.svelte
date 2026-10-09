<script lang="ts">
  import { Check, CircleAlert, SlidersHorizontal } from '@lucide/svelte';

  import { formatMenuPrice } from '$lib/api/mappers';
  import { getMenuItemImage } from '$lib/content/menu';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import type { PublicMenuCategory, PublicMenuItem } from '$lib/api/types';

  let { item, category } = $props<{
    item: PublicMenuItem;
    category: Pick<PublicMenuCategory, 'slug' | 'nameEs'>;
  }>();

  const image = $derived(getMenuItemImage(item, category));
</script>

<article class="product-detail">
  <div class="product-detail__media">
    <img src={image} alt={'Fotografía provisional de ' + item.nameEs} />
    <span class="product-detail__caption">Imagen editorial provisional</span>
  </div>

  <div class="product-detail__body">
    <p class="product-detail__category">{category.nameEs}</p>
    <h1 class="product-detail__title">{item.nameEs}</h1>
    <p class="product-detail__description">
      {item.descriptionEs ?? 'Consulta con nuestro equipo los detalles de esta opción.'}
    </p>

    <div class="product-detail__variants">
      {#each item.variants as variant (variant.id)}
        <section class="product-detail__variant" aria-label={'Presentación ' + variant.nameEs}>
          <div class="product-detail__variant-heading">
            <div>
              <h2 class="product-detail__variant-title">{variant.nameEs}</h2>
              <p class="product-detail__price">{formatMenuPrice(variant)}</p>
            </div>
            <Badge variant={variant.available ? 'secondary' : 'outline'}>
              {variant.available ? 'Disponible' : 'No disponible'}
            </Badge>
          </div>

          {#if variant.allergens.length > 0}
            <div class="product-detail__group">
              <h3 class="product-detail__group-title">
                <CircleAlert size={16} aria-hidden="true" /> Alérgenos
              </h3>
              <ul class="product-detail__list">
                {#each variant.allergens as allergen (allergen.id)}
                  <li>
                    {allergen.nameEs} ({allergen.presenceType === 'contains'
                      ? 'contiene'
                      : 'puede contener'})
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if variant.modifierGroups.length > 0}
            <div class="product-detail__group">
              <h3 class="product-detail__group-title">
                <SlidersHorizontal size={16} aria-hidden="true" /> Opciones
              </h3>
              <ul class="product-detail__list">
                {#each variant.modifierGroups as group (group.id)}
                  <li><Check size={15} aria-hidden="true" /> {group.nameEs}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </section>
      {:else}
        <p class="product-detail__empty">No hay presentaciones publicadas para este producto.</p>
      {/each}
    </div>
  </div>
</article>

<style>
  /* Detalle en dos columnas: la imagen editorial conserva protagonismo y la API controla los datos. */
  .product-detail {
    display: grid;
    overflow: hidden;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .product-detail__media {
    position: relative;
    min-block-size: 18rem;
    background: var(--surface-warm);
  }

  .product-detail__media img {
    inline-size: 100%;
    block-size: 100%;
    min-block-size: 18rem;
    object-fit: cover;
  }

  .product-detail__caption {
    position: absolute;
    inset-block-end: var(--space-md);
    inset-inline-start: var(--space-md);
    padding: 0.35rem 0.55rem;
    color: var(--primary-foreground);
    background: color-mix(in oklab, var(--coffee-950) 78%, transparent);
    border-radius: var(--radius-sm);
    font-size: 0.72rem;
  }

  .product-detail__body {
    display: grid;
    align-content: start;
    gap: var(--space-md);
    padding: clamp(var(--space-lg), 5vw, var(--space-2xl));
  }

  .product-detail__category {
    margin: 0;
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .product-detail__title {
    margin: 0;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
  }

  .product-detail__description {
    margin: 0;
    color: var(--text-muted);
    font-size: var(--font-size-lg);
  }

  .product-detail__variants {
    display: grid;
    gap: var(--space-md);
    margin-block-start: var(--space-lg);
  }

  .product-detail__variant {
    display: grid;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-sunken);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .product-detail__variant-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .product-detail__variant-title {
    margin: 0;
    font-size: 1.35rem;
  }

  .product-detail__price {
    margin: var(--space-xs) 0 0;
    color: var(--primary);
    font-weight: var(--font-weight-bold);
  }

  .product-detail__group-title {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    margin: 0 0 var(--space-xs);
    font-family: var(--font-family-base);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  .product-detail__list {
    display: grid;
    gap: var(--space-xs);
    margin: 0;
    padding-inline-start: 1.1rem;
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .product-detail__list li {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .product-detail__empty {
    margin: 0;
    color: var(--text-muted);
  }

  @media (min-width: 48rem) {
    .product-detail {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    .product-detail__media,
    .product-detail__media img {
      min-block-size: 36rem;
    }
  }
</style>
