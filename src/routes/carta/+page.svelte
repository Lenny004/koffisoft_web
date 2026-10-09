<script lang="ts">
  import { ArrowLeft, SlidersHorizontal } from '@lucide/svelte';

  import { getCategoryImage } from '$lib/content/menu';
  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Carta | Koffi-Soft</title>
  <meta
    name="description"
    content="Consulta la carta pública de Koffi-Soft, agrupada por categorías y filtrable por alérgenos."
  />
</svelte:head>

<div class="menu-page">
  <section class="menu-page__intro">
    <SectionHeading
      level="h1"
      title="Nuestra carta"
      eyebrow="Sabores para compartir"
      description="Opciones publicadas para disfrutar el café, la cocina y el paisaje."
    />
  </section>

  <section class="menu-filter" aria-labelledby="menu-filter-title">
    <div class="menu-filter__heading">
      <SlidersHorizontal size={19} aria-hidden="true" />
      <h2 id="menu-filter-title">Filtrar la carta</h2>
    </div>
    <form class="menu-filter__form" method="GET">
      <label class="menu-filter__field">
        <span>Categoría</span>
        <select name="category" value={data.filters.category}>
          <option value="">Todas las categorías</option>
          {#each data.menu?.categories ?? [] as category (category.id)}
            <option value={category.slug}>{category.nameEs}</option>
          {/each}
        </select>
      </label>
      <label class="menu-filter__field">
        <span>Alérgeno</span>
        <input
          name="allergen"
          value={data.filters.allergen}
          placeholder="Ej. GLUTEN"
          maxlength="40"
        />
      </label>
      <Button type="submit">Aplicar filtros</Button>
      {#if data.filters.category || data.filters.allergen}
        <Button href="/carta" variant="ghost">Limpiar</Button>
      {/if}
    </form>
  </section>

  {#if data.errorMessage}
    <StatusMessage title="Carta no disponible" message={data.errorMessage} variant="destructive" />
  {:else if !data.menu || data.menu.categories.length === 0}
    <StatusMessage
      title="Todavía no hay opciones publicadas"
      message="La carta se mostrará aquí cuando la sede tenga ítems visibles para el sitio público."
    />
  {:else}
    <div class="menu-page__categories">
      {#each data.menu.categories as category (category.id)}
        {#if category.items.length > 0}
          <section class="menu-category" aria-labelledby={'category-' + category.slug}>
            <div class="menu-category__heading">
              <div class="menu-category__title-wrap">
                <img
                  class="menu-category__image"
                  src={category.imageUrl ?? getCategoryImage(category)}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <p class="menu-category__eyebrow">Categoría</p>
                  <h2 id={'category-' + category.slug} class="menu-category__title">
                    {category.nameEs}
                  </h2>
                  {#if category.descriptionEs}<p class="menu-category__description">
                      {category.descriptionEs}
                    </p>{/if}
                </div>
              </div>
              <span class="menu-category__count">{category.items.length} opciones</span>
            </div>
            <div class="menu-category__grid">
              {#each category.items as item (item.id)}
                <MenuItemCard {item} {category} categoryName={category.nameEs} />
              {/each}
            </div>
          </section>
        {/if}
      {/each}
    </div>
  {/if}

  <div class="menu-page__back">
    <Button href="/" variant="link"
      ><ArrowLeft size={16} aria-hidden="true" /> Volver al inicio</Button
    >
  </div>
</div>

<style>
  /* Catálogo por categorías: filtros GET y datos de carta permanecen en la frontera server-only. */
  .menu-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-xl) 0;
  }

  .menu-page__intro {
    padding-block: var(--space-lg) var(--space-xl);
  }

  .menu-filter {
    display: grid;
    gap: var(--space-lg);
    margin-block-end: var(--space-2xl);
    padding: var(--space-lg);
    background: var(--surface-warm);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .menu-filter__heading {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--primary);
  }

  .menu-filter__heading h2 {
    margin: 0;
    font-size: 1.35rem;
  }

  .menu-filter__form {
    display: grid;
    align-items: end;
    gap: var(--space-md);
  }

  .menu-filter__field {
    display: grid;
    gap: var(--space-xs);
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  .menu-filter__field input,
  .menu-filter__field select {
    min-block-size: 2.75rem;
    padding-inline: var(--space-sm);
    color: var(--foreground);
    background: var(--surface-raised);
    border: 1px solid var(--input);
    border-radius: var(--radius-sm);
  }

  .menu-page__categories {
    display: grid;
    gap: var(--space-2xl);
  }

  .menu-category__heading {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    margin-block-end: var(--space-lg);
  }

  .menu-category__title-wrap {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .menu-category__image {
    inline-size: 4.5rem;
    block-size: 4.5rem;
    object-fit: cover;
    border-radius: var(--radius-full);
  }

  .menu-category__eyebrow {
    margin: 0 0 var(--space-xs);
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .menu-category__title {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 2.7rem);
  }

  .menu-category__description {
    max-inline-size: 40rem;
    margin: var(--space-xs) 0 0;
    color: var(--text-muted);
  }

  .menu-category__count {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .menu-category__grid {
    display: grid;
    gap: var(--space-lg);
  }

  .menu-page__back {
    margin-block: var(--space-xl);
  }

  @media (min-width: 40rem) {
    .menu-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .menu-filter__form {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto;
    }
  }

  @media (min-width: 52rem) {
    .menu-category__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
