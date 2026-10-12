<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowLeft } from '@lucide/svelte';

  import CatalogHero from '$lib/components/public/catalog-hero.svelte';
  import CatalogRail from '$lib/components/public/catalog-rail.svelte';
  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import FormField from '$lib/components/ui/form-field.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import { FORM_LIMITS } from '$lib/validation/limits';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const activeCategory = $derived(
    data.navigation.find((category) => category.slug === data.filters.category) ?? null,
  );
  const heroTitle = $derived(
    activeCategory?.nameEs ?? 'La carta para comer, beber y quedarte un rato más',
  );
  const heroLabel = $derived(activeCategory ? 'Carta' : 'Sabores para compartir');
  const heroDescription = $derived(
    activeCategory?.descriptionEs ??
      'Opciones publicadas para disfrutar el café, la cocina y el paisaje.',
  );
</script>

<svelte:head>
  <title>Carta | Koffi-Soft</title>
  <meta
    name="description"
    content="Consulta la carta pública de Koffi-Soft, agrupada por categorías y filtrable por alérgenos."
  />
</svelte:head>

<div class="menu-page">
  <div class="catalog-page__band">
    <CatalogHero
      titleId="menu-hero-title"
      title={heroTitle}
      label={heroLabel}
      description={heroDescription}
    />
    {#if data.preview}
      <p class="catalog-preview">
        Vista de ejemplo. La carta publicada de la sede reemplaza estas fotos y precios.
      </p>
    {/if}
  </div>

  <CatalogRail
    categories={data.navigation}
    currentSlug={data.filters.category}
    indicateCurrent={true}
    allergen={data.filters.allergen}
  >
    {#snippet aside()}
      <details class="catalog-filter" open={data.filters.allergen !== ''}>
        <summary class="catalog-filter__toggle">Filtrar</summary>
        <form class="catalog-filter__panel" method="GET">
          {#if data.filters.category}
            <input type="hidden" name="category" value={data.filters.category} />
          {/if}
          <FormField id="menu-allergen" label="Alérgeno">
            <Input
              id="menu-allergen"
              name="allergen"
              value={data.filters.allergen}
              placeholder="Ej. GLUTEN"
              maxlength={FORM_LIMITS.menu.allergenMaxLength}
              autocomplete="off"
            />
          </FormField>
          <div class="catalog-filter__actions">
            <Button type="submit" size="sm">Aplicar</Button>
            {#if data.filters.category || data.filters.allergen}
              <Button href={resolve('/carta')} variant="ghost" size="sm">Limpiar</Button>
            {/if}
          </div>
        </form>
      </details>
    {/snippet}
  </CatalogRail>

  <div class="catalog-page__band menu-page__body">
    {#if data.errorMessage}
      <StatusMessage
        title="Carta no disponible"
        message={data.errorMessage}
        variant="destructive"
      />
    {:else if !data.menu || data.menu.categories.length === 0}
      <StatusMessage
        title="Todavía no hay opciones publicadas"
        message="La carta se mostrará aquí cuando la sede tenga ítems visibles para el sitio público."
      />
    {:else}
      {@const visibleCategories = data.menu.categories.filter(
        (category) => category.items.length > 0,
      )}
      {#if visibleCategories.length === 0}
        <StatusMessage
          title="Sin coincidencias"
          message="Ninguna opción publicada coincide con el filtro de alérgeno."
        />
      {:else}
        <div class="menu-page__categories">
          {#each visibleCategories as category (category.id)}
            <section class="menu-category" aria-label={category.nameEs}>
              {#if visibleCategories.length > 1}
                <h2 class="menu-category__title">{category.nameEs}</h2>
              {/if}
              <div class="catalog-grid">
                {#each category.items as item (item.id)}
                  <MenuItemCard {item} {category} categoryName={category.nameEs} />
                {/each}
              </div>
            </section>
          {/each}
        </div>
      {/if}
    {/if}

    <div class="menu-page__back">
      <Button href="/" variant="link"
        ><ArrowLeft size={16} aria-hidden="true" /> Volver al inicio</Button
      >
    </div>
  </div>
</div>

<style>
  /* Carta: el filtro cuelga de la barra; la rejilla usa el mismo ritmo que el inicio. */
  .menu-page {
    font-family: var(--font-family-menu);
    font-weight: var(--font-weight-light);
    letter-spacing: var(--letter-spacing-menu);
  }

  .catalog-filter {
    position: relative;
  }

  .catalog-filter__toggle {
    color: var(--foreground);
    font-size: 0.75rem;
    letter-spacing: var(--letter-spacing-label);
    list-style: none;
    text-transform: uppercase;
    cursor: pointer;
  }

  .catalog-filter__toggle::marker {
    content: '';
  }

  .catalog-filter__toggle:hover,
  .catalog-filter__toggle:focus-visible {
    text-decoration: underline;
    text-underline-offset: 0.35em;
  }

  .catalog-filter__panel {
    position: absolute;
    inset-block-start: calc(100% + var(--space-sm));
    inset-inline-end: 0;
    z-index: var(--z-dropdown);
    display: grid;
    gap: var(--space-sm);
    inline-size: min(18rem, 80vw);
    padding: var(--space-md);
    background: var(--surface-raised);
    border: 1px solid var(--border);
  }

  .catalog-filter__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .menu-page__body {
    padding-block-start: var(--space-xl);
  }

  .menu-page__categories {
    display: grid;
    gap: var(--space-2xl);
  }

  .menu-category__title {
    margin: 0 0 var(--space-lg);
    font-family: var(--font-family-editorial);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.15;
  }

  .menu-page__back {
    margin-block: var(--space-xl);
  }
</style>
