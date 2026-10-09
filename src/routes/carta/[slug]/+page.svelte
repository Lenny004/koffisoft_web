<script lang="ts">
  import { ArrowLeft, Check, CircleAlert } from '@lucide/svelte';

  import { formatMenuPrice } from '$lib/api/mappers';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import { cn } from '$lib/utils.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.item?.item.nameEs ?? 'Detalle de la carta'} | Koffi-Soft</title>
  <meta
    name="description"
    content={data.item?.item.descriptionEs ??
      'Detalle de un ítem de la carta pública de Koffi-Soft.'}
  />
</svelte:head>

<div class="menu-detail-page">
  <Button href="/carta" variant="link" class="menu-detail-page__back">
    <ArrowLeft size={16} aria-hidden="true" /> Volver a la carta
  </Button>

  {#if data.errorMessage || !data.item}
    <StatusMessage
      title="Ítem no disponible"
      message={data.errorMessage ?? 'No encontramos este ítem en la carta pública.'}
      variant="destructive"
    />
  {:else}
    <article class="menu-detail">
      <header class="menu-detail__header">
        <p class="menu-detail__category">{data.item.category.nameEs}</p>
        <h1 class="menu-detail__title">{data.item.item.nameEs}</h1>
        {#if data.item.item.descriptionEs}
          <p class="menu-detail__description">{data.item.item.descriptionEs}</p>
        {/if}
      </header>

      <section class="menu-detail__variants" aria-labelledby="variants-title">
        <h2 id="variants-title" class="menu-detail__section-title">Presentaciones</h2>
        <div class="menu-detail__variant-grid">
          {#each data.item.item.variants as variant (variant.id)}
            <Card class={cn('menu-variant', !variant.available && 'menu-variant--unavailable')}>
              <CardHeader class="menu-variant__header">
                <CardTitle class="menu-variant__title">{variant.nameEs}</CardTitle>
                <Badge variant={variant.available ? 'secondary' : 'outline'}>
                  {variant.available ? 'Disponible' : 'No disponible'}
                </Badge>
              </CardHeader>
              <CardContent class="menu-variant__content">
                <p class="menu-variant__price">{formatMenuPrice(variant)}</p>
                {#if variant.allergens.length > 0}
                  <div class="menu-variant__group">
                    <h3 class="menu-variant__group-title">Alérgenos</h3>
                    <ul class="menu-variant__list">
                      {#each variant.allergens as allergen (allergen.id)}
                        <li class="menu-variant__list-item">
                          <CircleAlert size={15} aria-hidden="true" />
                          {allergen.nameEs} ({allergen.presenceType === 'contains'
                            ? 'contiene'
                            : 'puede contener'})
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
                {#if variant.modifierGroups.length > 0}
                  <div class="menu-variant__group">
                    <h3 class="menu-variant__group-title">Opciones</h3>
                    <ul class="menu-variant__list">
                      {#each variant.modifierGroups as group (group.id)}
                        <li class="menu-variant__list-item">
                          <Check size={15} aria-hidden="true" />
                          {group.nameEs}
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </CardContent>
            </Card>
          {/each}
        </div>
      </section>
    </article>
  {/if}
</div>

<style>
  /* El detalle muestra únicamente variantes, alérgenos y modificadores devueltos por la API. */
  .menu-detail-page {
    inline-size: min(100% - 2rem, 56rem);
    margin-inline: auto;
    padding-block: 3rem 1rem;
  }

  :global(.menu-detail-page__back) {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding-inline: 0;
  }

  .menu-detail {
    padding-block: 2rem 4rem;
  }

  .menu-detail__category {
    margin: 0 0 0.5rem;
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .menu-detail__title {
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(2.8rem, 8vw, 5rem);
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  .menu-detail__description {
    max-inline-size: 40rem;
    margin: var(--space-lg) 0 0;
    color: var(--muted-foreground);
    font-size: 1.1rem;
  }

  .menu-detail__variants {
    margin-block-start: 3rem;
  }

  .menu-detail__section-title {
    margin: 0 0 var(--space-lg);
    font-family: Georgia, serif;
    font-size: 1.6rem;
  }

  .menu-detail__variant-grid {
    display: grid;
    gap: var(--space-lg);
  }

  :global(.menu-variant) {
    overflow: hidden;
  }

  :global(.menu-variant--unavailable) {
    opacity: 0.78;
  }

  :global(.menu-variant__header) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  :global(.menu-variant__title) {
    font-family: Georgia, serif;
    font-size: 1.25rem;
  }

  :global(.menu-variant__content) {
    display: grid;
    gap: var(--space-lg);
  }

  .menu-variant__price {
    margin: 0;
    color: var(--primary);
    font-size: 1.25rem;
    font-weight: 700;
  }

  .menu-variant__group-title {
    margin: 0 0 0.5rem;
    font-size: 0.85rem;
  }

  .menu-variant__list {
    display: grid;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    color: var(--muted-foreground);
    font-size: 0.9rem;
    list-style: none;
  }

  .menu-variant__list-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  @media (min-width: 48rem) {
    .menu-detail-page {
      inline-size: min(100% - 3rem, 56rem);
      padding-block-start: 5rem;
    }

    .menu-detail__variant-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
