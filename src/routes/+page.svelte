<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowRight, CalendarDays, Coffee, MapPin } from '@lucide/svelte';

  import { getCategoryImage } from '$lib/content/menu';
  import CategoryCard from '$lib/components/public/category-card.svelte';
  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent } from '$lib/components/ui/card/index.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Koffi-Soft | Menú de café y montaña</title>
  <meta
    name="description"
    content="Explora el menú de Koffi-Soft, sus categorías, favoritos, reservas y experiencias en la Ruta Panorámica."
  />
</svelte:head>

<div class="home-page">
  <section class="home-page__intro">
    <SectionHeading
      level="h1"
      title="Menú"
      eyebrow="Sabores de la montaña"
      description="Una carta para disfrutar el café, la cocina y el paisaje con calma."
    />
    <div class="home-page__intro-meta">
      <span><Coffee size={17} aria-hidden="true" /> Café y cocina de temporada</span>
      <span><MapPin size={17} aria-hidden="true" /> Ruta Panorámica, El Salvador</span>
    </div>
  </section>

  <section class="home-section" aria-labelledby="categories-title">
    <div class="home-section__heading">
      <h2 id="categories-title" class="home-section__title">Explora por categoría</h2>
      <p class="home-section__copy">Encuentra algo para cada momento del día.</p>
    </div>

    {#if data.errorMessage}
      <StatusMessage
        title="Carta temporalmente no disponible"
        message={data.errorMessage}
        variant="destructive"
      />
    {:else if data.categories.length === 0}
      <StatusMessage
        title="Estamos preparando la carta pública"
        message="Las categorías aparecerán aquí cuando la sede tenga opciones publicadas."
      />
    {:else}
      <div class="home-section__category-grid">
        {#each data.categories as category (category.id)}
          <CategoryCard
            href={'/carta?category=' + category.slug}
            title={category.nameEs}
            description={category.descriptionEs}
            image={category.imageUrl ?? getCategoryImage(category)}
            imageAlt={'Fotografía de ' + category.nameEs}
          />
        {/each}
      </div>
    {/if}
  </section>

  <section class="home-section home-section--favorites" aria-labelledby="favorites-title">
    <SectionHeading
      title="Productos favoritos"
      eyebrow="Los más consultados"
      description="Precios y disponibilidad corresponden a la publicación actual de la sede."
    />

    {#if data.errorMessage}
      <StatusMessage
        title="Favoritos no disponibles"
        message={data.errorMessage}
        variant="destructive"
      />
    {:else if data.featuredItems.length === 0}
      <Card class="home-empty"
        ><CardContent
          ><p class="home-empty__message">No hay favoritos publicados por ahora.</p></CardContent
        ></Card
      >
    {:else}
      <div class="home-section__product-grid">
        {#each data.featuredItems as featuredItem (featuredItem.item.id)}
          <MenuItemCard
            item={featuredItem.item}
            categoryName={featuredItem.categoryName}
            category={{ slug: featuredItem.categorySlug, nameEs: featuredItem.categoryName }}
            featured
          />
        {/each}
      </div>
    {/if}
  </section>

  <section class="home-page__secondary" aria-label="Más experiencias">
    <a class="home-page__secondary-card" href={resolve('/reservas')}>
      <span class="home-page__secondary-icon"><CalendarDays size={24} aria-hidden="true" /></span>
      <span>
        <strong>Reserva tu mesa</strong>
        <small>Planea una pausa con tu gente.</small>
      </span>
      <ArrowRight size={20} aria-hidden="true" />
    </a>
    <a class="home-page__secondary-card" href={resolve('/eventos')}>
      <span class="home-page__secondary-icon"><MapPin size={24} aria-hidden="true" /></span>
      <span>
        <strong>Celebra con vista</strong>
        <small>Conoce nuestros espacios para eventos.</small>
      </span>
      <ArrowRight size={20} aria-hidden="true" />
    </a>
  </section>

  <div class="home-page__cta">
    <p>¿Quieres conocer todo lo que tenemos para compartir?</p>
    <Button href="/carta" variant="outline"
      >Ver la carta completa <ArrowRight size={17} aria-hidden="true" /></Button
    >
  </div>
</div>

<style>
  /* La portada sigue el orden del legacy: título, categorías, favoritos y llamados secundarios. */
  .home-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-xl) 0;
  }

  .home-page__intro {
    padding-block: var(--space-lg) var(--space-xl);
  }

  .home-page__intro-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-md);
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .home-page__intro-meta span {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .home-section {
    padding-block: var(--space-xl);
  }

  .home-section--favorites {
    padding-block-start: var(--space-2xl);
  }

  .home-section__heading {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-md);
    margin-block-end: var(--space-lg);
  }

  .home-section__title {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 2.7rem);
  }

  .home-section__copy {
    margin: 0;
    color: var(--text-muted);
  }

  .home-section__category-grid,
  .home-section__product-grid {
    display: grid;
    gap: var(--space-lg);
  }

  .home-section__product-grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  }

  .home-empty__message {
    margin: 0;
    color: var(--text-muted);
  }

  .home-page__secondary {
    display: grid;
    gap: var(--space-md);
    padding-block: var(--space-xl);
  }

  .home-page__secondary-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    color: var(--foreground);
    background: var(--surface-warm);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast);
  }

  .home-page__secondary-card:hover {
    background: var(--accent);
    transform: translateY(-0.15rem);
  }

  .home-page__secondary-card strong,
  .home-page__secondary-card small {
    display: block;
  }

  .home-page__secondary-card strong {
    font-family: var(--font-family-display);
    font-size: 1.3rem;
  }

  .home-page__secondary-card small {
    margin-block-start: 0.2rem;
    color: var(--text-muted);
  }

  .home-page__secondary-icon {
    display: grid;
    place-items: center;
    inline-size: 3rem;
    block-size: 3rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
  }

  .home-page__cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    margin-block: var(--space-lg) var(--space-xl);
    padding: var(--space-lg);
    color: var(--text-on-brand);
    background: var(--surface-brand);
    border-radius: var(--radius-lg);
  }

  .home-page__cta p {
    margin: 0;
    font-family: var(--font-family-display);
    font-size: 1.35rem;
  }

  @media (min-width: 40rem) {
    .home-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .home-section__category-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .home-page__secondary {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .home-section__category-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
