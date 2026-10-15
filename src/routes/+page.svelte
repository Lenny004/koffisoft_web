<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowRight, Megaphone } from '@lucide/svelte';

  import CatalogHero from '$lib/components/public/catalog-hero.svelte';
  import CatalogRail from '$lib/components/public/catalog-rail.svelte';
  import { isSafeAnnouncementCtaUrl } from '$lib/content/announcements';
  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
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
  <div class="catalog-page__band">
    <CatalogHero
      titleId="home-hero-title"
      title="Descubre los favoritos del café y la cocina de montaña"
      label="Carta de la casa"
      description="Platos, bebidas y postres publicados por la sede. Precios y disponibilidad de hoy, para elegir con calma."
    />
    {#if data.preview}
      <p class="catalog-preview">
        Vista de ejemplo. La carta publicada de la sede reemplaza estas fotos y precios.
      </p>
    {/if}
  </div>

  {#if data.announcements.length > 0}
    <section class="catalog-page__band announcement" aria-labelledby="announcement-title">
      <div class="announcement__icon"><Megaphone size={24} aria-hidden="true" /></div>
      <div class="announcement__content">
        <p class="announcement__eyebrow">Important Announcement</p>
        {#each data.announcements as announcement (announcement.id)}
          <article class="announcement__item">
            <h2
              id={announcement.id === data.announcements[0].id ? 'announcement-title' : undefined}
              class="announcement__title"
            >
              {announcement.title}
            </h2>
            <p class="announcement__message">{announcement.message}</p>
            {#if announcement.ctaLabel && announcement.ctaUrl && isSafeAnnouncementCtaUrl(announcement.ctaUrl)}
              {#if announcement.ctaUrl.startsWith('/')}
                <a class="announcement__link" href={resolve(announcement.ctaUrl as '/')}
                  >{announcement.ctaLabel} <ArrowRight size={16} aria-hidden="true" /></a
                >
              {:else}
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a class="announcement__link" href={announcement.ctaUrl}
                  >{announcement.ctaLabel} <ArrowRight size={16} aria-hidden="true" /></a
                >
              {/if}
            {/if}
          </article>
        {/each}
        <a class="announcement__link" href={resolve('/avisos')}
          >Leer el aviso completo <ArrowRight size={16} aria-hidden="true" /></a
        >
      </div>
    </section>
  {/if}

  <CatalogRail categories={data.categories} />

  <div class="catalog-page__band">
    {#if data.errorMessage}
      <StatusMessage
        title="Carta temporalmente no disponible"
        message={data.errorMessage}
        variant="destructive"
      />
    {:else if data.categories.length === 0 && data.featuredItems.length === 0}
      <StatusMessage
        title="Estamos preparando la carta pública"
        message="Las categorías y los favoritos aparecerán aquí cuando la sede tenga opciones publicadas."
      />
    {:else}
      <section aria-labelledby="favorites-title">
        <h2 id="favorites-title" class="sr-only">Favoritos de la carta</h2>
        {#if data.featuredItems.length === 0}
          <StatusMessage
            title="Sin favoritos publicados"
            message="La barra de arriba lleva a cada categoría en cuanto haya opciones visibles."
          />
        {:else}
          <div class="catalog-grid catalog-grid--lead">
            {#each data.featuredItems as featuredItem (featuredItem.item.id)}
              <MenuItemCard item={featuredItem.item} categoryName={featuredItem.categoryName} />
            {/each}
          </div>
        {/if}
      </section>
    {/if}

    <section class="home-page__extra" aria-label="Más experiencias">
      <a class="home-page__extra-link" href={resolve('/reservas')}>
        <span class="home-page__extra-title">Reserva tu mesa</span>
        <span class="home-page__extra-copy">Planea una pausa con tu gente.</span>
      </a>
      <a class="home-page__extra-link" href={resolve('/eventos')}>
        <span class="home-page__extra-title">Celebra con vista</span>
        <span class="home-page__extra-copy">Espacios para reuniones y celebraciones.</span>
      </a>
    </section>
  </div>
</div>

<style>
  /* Portada de catálogo: el ancho vive en catalog.css para que la barra llegue de lado a lado. */
  .announcement {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-md);
    margin-block-end: var(--space-lg);
    padding: var(--space-lg);
    color: var(--text-on-brand);
    background: var(--surface-brand);
    border: 1px solid color-mix(in oklab, var(--text-on-brand) 18%, transparent);
    border-radius: var(--radius-lg);
  }

  .announcement__icon {
    display: grid;
    place-items: center;
    inline-size: 3rem;
    block-size: 3rem;
    color: var(--surface-brand);
    background: var(--accent);
    border-radius: var(--radius-full);
  }

  .announcement__content,
  .announcement__item {
    display: grid;
    gap: var(--space-xs);
  }

  .announcement__eyebrow {
    margin: 0;
    color: var(--mountain-300);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .announcement__title,
  .announcement__message {
    margin: 0;
  }

  .announcement__title {
    font-size: clamp(1.5rem, 3vw, 2.1rem);
  }

  .announcement__message {
    color: color-mix(in oklab, var(--text-on-brand) 82%, transparent);
  }

  .announcement__item + .announcement__item {
    margin-block-start: var(--space-md);
    padding-block-start: var(--space-md);
    border-block-start: 1px solid color-mix(in oklab, var(--text-on-brand) 18%, transparent);
  }

  .announcement__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    inline-size: fit-content;
    margin-block-start: var(--space-xs);
    color: var(--text-on-brand);
    font-weight: var(--font-weight-bold);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .home-page__extra {
    display: grid;
    gap: var(--space-lg);
    margin-block: var(--space-2xl) var(--space-xl);
    padding-block-start: var(--space-lg);
    border-block-start: 1px solid var(--border);
  }

  .home-page__extra-link {
    display: grid;
    gap: 0.2rem;
    color: var(--foreground);
    text-decoration: none;
  }

  .home-page__extra-title {
    font-family: var(--font-family-editorial);
    font-size: 1.5rem;
  }

  .home-page__extra-copy {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .home-page__extra-link:hover .home-page__extra-title,
  .home-page__extra-link:focus-visible .home-page__extra-title {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  @media (min-width: 40rem) {
    .home-page__extra {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
