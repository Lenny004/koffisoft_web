<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowLeft } from '@lucide/svelte';

  import CatalogHero from '$lib/components/public/catalog-hero.svelte';
  import CatalogRail from '$lib/components/public/catalog-rail.svelte';
  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Combobox, type ComboboxOption } from '$lib/components/ui/combobox/index.js';
  import FormField from '$lib/components/ui/form-field.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let categoryFilter = $state('');
  let allergenFilter = $state('');

  $effect.pre(() => {
    categoryFilter = data.filters.category;
    allergenFilter = data.filters.allergen;
  });

  const categoryOptions = $derived<ComboboxOption[]>(
    data.navigation.map((category) => ({
      value: category.slug,
      label: category.nameEs,
      keywords: [category.slug, category.nameEn],
    })),
  );
  const allergenOptions = $derived<ComboboxOption[]>(
    data.allergens.map((allergen) => ({
      value: allergen.code,
      label: allergen.nameEs,
      keywords: [allergen.code],
    })),
  );

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
      <details
        class="catalog-filter"
        open={Boolean(data.filters.allergen || data.filters.category)}
      >
        <summary class="catalog-filter__toggle">Filtrar</summary>
        <form class="catalog-filter__panel" method="GET">
          <FormField id="menu-category" label="Categoría">
            <Combobox
              id="menu-category"
              name="category"
              bind:value={categoryFilter}
              allowEmpty
              placeholder="Toda la carta"
              searchPlaceholder="Buscar categoría…"
              emptyText="No encontramos esa categoría."
              options={categoryOptions}
            />
          </FormField>
          <FormField id="menu-allergen" label="Alérgeno">
            <Combobox
              id="menu-allergen"
              name="allergen"
              bind:value={allergenFilter}
              allowEmpty
              placeholder="Todos los alérgenos"
              searchPlaceholder="Buscar alérgeno…"
              emptyText="No encontramos ese alérgeno."
              options={allergenOptions}
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
                  <MenuItemCard {item} categoryName={category.nameEs} />
                {/each}
              </div>
            </section>
          {/each}
        </div>
      {/if}
    {/if}

    <div class="menu-page__back">
      <Button href={resolve('/')} variant="link"
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
    inline-size: min(20rem, 80vw);
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
