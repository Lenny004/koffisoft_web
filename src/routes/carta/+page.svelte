<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowLeft } from '@lucide/svelte';

  import { getCategoryImage } from '$lib/content/menu';
  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
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
  const heroCategory = $derived(activeCategory ?? data.navigation[0] ?? null);
  const heroTitle = $derived(activeCategory?.nameEs ?? 'Nuestra carta');
  const heroDescription = $derived(
    activeCategory?.descriptionEs ??
      'Opciones publicadas para disfrutar el café, la cocina y el paisaje.',
  );

  function cartaHref(category = '', allergen = data.filters.allergen) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (allergen) params.set('allergen', allergen);
    const query = params.toString();
    const path = resolve('/carta');
    return query ? `${path}?${query}` : path;
  }
</script>

<svelte:head>
  <title>Carta | Koffi-Soft</title>
  <meta
    name="description"
    content="Consulta la carta pública de Koffi-Soft, agrupada por categorías y filtrable por alérgenos."
  />
</svelte:head>

<div class="menu-page">
  <section class="menu-hero" aria-labelledby="menu-hero-title">
    <div class="menu-hero__copy">
      <SectionHeading
        level="h1"
        align="start"
        flush
        titleId="menu-hero-title"
        eyebrow="Sabores para compartir"
        title={heroTitle}
        description={heroDescription}
      />
    </div>
    {#if heroCategory}
      <img
        class="menu-hero__image"
        src={heroCategory.imageUrl ?? getCategoryImage(heroCategory)}
        alt={'Fotografía de ' + heroCategory.nameEs}
      />
    {/if}
  </section>

  <div class="menu-toolbar">
    <nav class="menu-rail" aria-label="Categorías de la carta">
      <!-- La consulta conserva el alérgeno; resolve() solo cubre la ruta base. -->
      <!-- eslint-disable svelte/no-navigation-without-resolve -->
      <ul class="menu-rail__list">
        <li class="menu-rail__item">
          <a
            class="menu-rail__link"
            class:menu-rail__link--current={!data.filters.category}
            href={cartaHref()}
            aria-current={!data.filters.category ? 'page' : undefined}>Todas</a
          >
        </li>
        {#each data.navigation as category (category.id)}
          <li class="menu-rail__item">
            <a
              class="menu-rail__link"
              class:menu-rail__link--current={data.filters.category === category.slug}
              href={cartaHref(category.slug)}
              aria-current={data.filters.category === category.slug ? 'page' : undefined}
              >{category.nameEs}</a
            >
          </li>
        {/each}
      </ul>
      <!-- eslint-enable svelte/no-navigation-without-resolve -->
    </nav>

    <form class="menu-refine" method="GET">
      {#if data.filters.category}
        <input type="hidden" name="category" value={data.filters.category} />
      {/if}
      <div class="menu-refine__field">
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
      </div>
      <Button type="submit" size="sm">Filtrar</Button>
      {#if data.filters.category || data.filters.allergen}
        <Button href={cartaHref('', '')} variant="ghost" size="sm">Limpiar</Button>
      {/if}
    </form>
  </div>

  {#if data.errorMessage}
    <StatusMessage title="Carta no disponible" message={data.errorMessage} variant="destructive" />
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
            <div class="menu-category__grid">
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

<style>
  /* Carta pública: introducción partida, riel de categorías y cuadrícula de producto. */
  .menu-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-xl) 0;
    font-family: var(--font-family-menu);
    font-weight: var(--font-weight-light);
    letter-spacing: var(--letter-spacing-menu);
  }

  .menu-hero {
    display: grid;
    align-items: center;
    gap: var(--space-xl);
    margin-block-end: var(--space-xl);
  }

  .menu-hero__copy {
    padding-inline-start: var(--space-lg);
    border-inline-start: 1px solid var(--border);
  }

  .menu-hero__image {
    inline-size: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--surface-warm);
  }

  .menu-toolbar {
    display: grid;
    gap: var(--space-md);
    margin-block-end: var(--space-xl);
    padding-block: var(--space-sm);
    border-block: 1px solid var(--border);
  }

  .menu-rail__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm) var(--space-lg);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .menu-rail__link {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    letter-spacing: 0.08em;
    line-height: 1.4;
    text-decoration: none;
    text-transform: uppercase;
  }

  .menu-rail__link:hover,
  .menu-rail__link:focus-visible,
  .menu-rail__link--current {
    color: var(--foreground);
  }

  .menu-rail__link--current {
    text-decoration: underline;
    text-underline-offset: 0.35em;
  }

  .menu-refine {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: var(--space-sm);
  }

  .menu-refine__field {
    flex: 1 1 12rem;
    max-inline-size: 18rem;
  }

  .menu-page__categories {
    display: grid;
    gap: var(--space-2xl);
  }

  .menu-category__title {
    margin: 0 0 var(--space-lg);
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0;
    line-height: 1.2;
  }

  .menu-category__grid {
    display: grid;
    gap: var(--space-xl) var(--space-md);
  }

  .menu-page__back {
    margin-block: var(--space-xl);
  }

  @media (min-width: 40rem) {
    .menu-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .menu-category__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .menu-hero {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    }

    .menu-toolbar {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
    }

    .menu-category__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
