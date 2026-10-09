<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowRight, Gift, Sparkles } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import Pagination from '$lib/components/public/pagination.svelte';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
</script>

<svelte:head>
  <title>Promociones | Koffi-Soft</title>
  <meta name="description" content="Conoce las novedades y promociones de Koffi-Soft." />
</svelte:head>

<div class="promotions-page">
  <SectionHeading
    level="h1"
    title="Promociones"
    eyebrow="Novedades para compartir"
    description="Este espacio está listo para recibir promociones publicadas por la API."
  />

  {#if editorialPlaceholder}
    <p class="promotions-page__notice">
      <Sparkles size={17} aria-hidden="true" /> Contenido editorial provisional: no se muestran precios
      ni vigencias inventadas.
    </p>
  {/if}

  <div class="promotions-page__grid">
    {#each siteContent.promotions as promotion (promotion.title)}
      <article class="promotion-card">
        <div class="promotion-card__icon" aria-hidden="true"><Gift size={24} /></div>
        <p class="promotion-card__label">{promotion.label}</p>
        <h2 class="promotion-card__title">{promotion.title}</h2>
        <p class="promotion-card__description">{promotion.description}</p>
        <a href={resolve('/contacto')} class="promotion-card__link"
          >Consultar novedades <ArrowRight size={16} aria-hidden="true" /></a
        >
      </article>
    {/each}
  </div>
  <Pagination
    page={1}
    totalPages={Math.max(1, Math.ceil(siteContent.promotions.length / 4))}
    baseHref="/promociones"
  />
</div>

<style>
  /* Catálogo editorial provisional preparado para sustituirse por datos de un endpoint aprobado. */
  .promotions-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .promotions-page__notice {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin: 0 auto var(--space-xl);
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
  }

  .promotions-page__grid {
    display: grid;
    gap: var(--space-lg);
  }

  .promotion-card {
    display: grid;
    gap: var(--space-sm);
    padding: var(--space-xl);
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .promotion-card__icon {
    display: grid;
    place-items: center;
    inline-size: 3rem;
    block-size: 3rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
  }

  .promotion-card__label {
    margin: var(--space-sm) 0 0;
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .promotion-card__title {
    margin: 0;
    font-size: 1.8rem;
  }

  .promotion-card__description {
    margin: 0;
    color: var(--text-muted);
  }

  .promotion-card__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    margin-block-start: var(--space-sm);
    color: var(--primary);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
  }

  @media (min-width: 48rem) {
    .promotions-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .promotions-page__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
