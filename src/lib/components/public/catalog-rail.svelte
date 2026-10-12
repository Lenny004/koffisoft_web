<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Snippet } from 'svelte';

  import '$lib/styles/catalog.css';

  interface CatalogCategory {
    id: string;
    slug: string;
    nameEs: string;
  }

  let {
    categories,
    currentSlug = '',
    indicateCurrent = false,
    allergen = '',
    aside,
  } = $props<{
    categories: CatalogCategory[];
    currentSlug?: string;
    indicateCurrent?: boolean;
    allergen?: string;
    aside?: Snippet;
  }>();

  function categoryHref(slug = ''): string {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (allergen) params.set('allergen', allergen);
    const query = params.toString();
    const path = resolve('/carta');
    return query ? `${path}?${query}` : path;
  }
</script>

<div class="catalog-rail">
  <div class="catalog-page__band catalog-rail__inner">
    <nav class="catalog-rail__nav" aria-label="Categorías de la carta">
      <!-- La consulta conserva el alérgeno; resolve() solo cubre la ruta base. -->
      <!-- eslint-disable svelte/no-navigation-without-resolve -->
      <ul class="catalog-rail__list">
        {#each categories as category (category.id)}
          <li class="catalog-rail__item">
            <a
              class="catalog-rail__link"
              class:catalog-rail__link--current={indicateCurrent && currentSlug === category.slug}
              href={categoryHref(category.slug)}
              aria-current={indicateCurrent && currentSlug === category.slug ? 'page' : undefined}
              >{category.nameEs}</a
            >
          </li>
        {/each}
        <li class="catalog-rail__item">
          <a
            class="catalog-rail__link"
            class:catalog-rail__link--current={indicateCurrent && !currentSlug}
            href={categoryHref()}
            aria-current={indicateCurrent && !currentSlug ? 'page' : undefined}>Toda la carta</a
          >
        </li>
      </ul>
      <!-- eslint-enable svelte/no-navigation-without-resolve -->
    </nav>
    {#if aside}
      <div class="catalog-rail__aside">{@render aside()}</div>
    {/if}
  </div>
</div>

<style>
  /* Barra de categorías: versalitas a la izquierda y el filtro alineado al extremo. */
  .catalog-rail {
    position: sticky;
    inset-block-start: var(--header-height);
    z-index: var(--z-dropdown);
    background: var(--background);
    border-block: 1px solid var(--border);
  }

  .catalog-rail__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm) var(--space-lg);
    min-block-size: 3.5rem;
    padding-block: var(--space-sm);
  }

  .catalog-rail__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm) var(--space-lg);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .catalog-rail__link {
    color: var(--foreground);
    font-size: 0.75rem;
    letter-spacing: var(--letter-spacing-label);
    line-height: 1.4;
    text-decoration: none;
    text-transform: uppercase;
  }

  .catalog-rail__link:hover,
  .catalog-rail__link:focus-visible,
  .catalog-rail__link--current {
    text-decoration: underline;
    text-underline-offset: 0.35em;
  }

  .catalog-rail__aside {
    margin-inline-start: auto;
  }
</style>
