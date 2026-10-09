<script lang="ts">
  import { resolve } from '$app/paths';
  import { Clock3, ExternalLink, MapPin, Phone } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
</script>

<svelte:head>
  <title>Ubicación | Koffi-Soft</title>
  <meta
    name="description"
    content="Encuentra Koffi-Soft en la Ruta Panorámica y consulta su horario."
  />
</svelte:head>

<div class="location-page">
  <SectionHeading
    level="h1"
    title="Ubicación"
    eyebrow="Ven a la montaña"
    description="Consulta la referencia de llegada y el horario antes de visitarnos."
  />
  {#if editorialPlaceholder}<p class="location-page__notice">
      Mapa, dirección y horario son referencias provisionales pendientes de confirmación.
    </p>{/if}

  <div class="location-page__grid">
    <div class="location-page__map">
      <iframe
        title="Mapa de referencia de la Ruta Panorámica de El Salvador"
        src="https://www.google.com/maps?q=Ruta%20Panoramica%20El%20Salvador&output=embed"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <aside class="location-page__details" aria-labelledby="location-details-title">
      <h2 id="location-details-title">Planifica tu visita</h2>
      <p>
        <MapPin class="location-page__detail-icon" size={20} aria-hidden="true" /><span
          >{siteContent.contact.address}</span
        >
      </p>
      <p>
        <Phone class="location-page__detail-icon" size={20} aria-hidden="true" /><span
          >{siteContent.contact.phone}</span
        >
      </p>
      <p>
        <Clock3 class="location-page__detail-icon" size={20} aria-hidden="true" /><span
          >{siteContent.contact.hours}</span
        >
      </p>
      <a href={resolve('/contacto')}
        >¿Necesitas indicaciones? <ExternalLink size={16} aria-hidden="true" /></a
      >
    </aside>
  </div>
</div>

<style>
  /* Mapa accesible con título explícito; el destino exacto se sustituirá cuando se confirme la sede. */
  .location-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .location-page__notice {
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
  }

  .location-page__grid {
    display: grid;
    gap: var(--space-lg);
    margin-block-start: var(--space-xl);
  }

  .location-page__map {
    min-block-size: 20rem;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .location-page__map iframe {
    inline-size: 100%;
    block-size: 100%;
    min-block-size: 20rem;
    border: 0;
  }

  .location-page__details {
    padding: var(--space-xl);
    background: var(--surface-brand);
    border-radius: var(--radius-lg);
  }

  .location-page__details h2 {
    margin: 0 0 var(--space-lg);
    color: var(--text-on-brand);
    font-size: 2rem;
  }

  .location-page__details p {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    margin: var(--space-md) 0 0;
    color: color-mix(in oklab, var(--text-on-brand) 82%, transparent);
  }

  .location-page__detail-icon {
    flex: 0 0 auto;
    color: var(--mountain-300);
  }

  .location-page__details a {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    margin-block-start: var(--space-xl);
    color: var(--text-on-brand);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
  }

  @media (min-width: 48rem) {
    .location-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .location-page__grid {
      grid-template-columns: 1.4fr 0.6fr;
      align-items: stretch;
    }
  }
</style>
