<script lang="ts">
  import { resolve } from '$app/paths';
  import { FileText } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
</script>

<svelte:head>
  <title>{siteContent.legal.termsTitle} | Koffi-Soft</title>
  <meta name="description" content="Consulta los términos de uso de Koffi-Soft." />
</svelte:head>

<div class="legal-page">
  <SectionHeading level="h1" title={siteContent.legal.termsTitle} eyebrow="Información legal" />
  <article class="legal-page__article">
    <div class="legal-page__icon" aria-hidden="true"><FileText size={25} /></div>
    {#if editorialPlaceholder}<p class="legal-page__notice">
        Documento provisional pendiente de revisión legal.
      </p>{/if}
    <h2>Uso del sitio</h2>
    <p>{siteContent.legal.placeholder}</p>
    <h2>Contenido publicado</h2>
    <p>
      La carta, disponibilidad y condiciones mostradas en el sitio dependen de la información
      publicada por Koffi-Soft y pueden requerir confirmación directa.
    </p>
    <h2>Contacto</h2>
    <p>
      Para solicitar una aclaración, utiliza la página de <a href={resolve('/contacto')}>contacto</a
      >.
    </p>
  </article>
</div>

<style>
  /* Texto legal corto y reemplazable hasta contar con el documento aprobado. */
  .legal-page {
    inline-size: min(calc(100% - 2rem), 54rem);
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .legal-page__article {
    padding: clamp(var(--space-lg), 5vw, var(--space-2xl));
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .legal-page__icon {
    display: grid;
    place-items: center;
    inline-size: 3rem;
    block-size: 3rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
  }

  .legal-page__notice {
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
  }

  .legal-page h2 {
    margin: var(--space-xl) 0 var(--space-sm);
    font-size: 1.5rem;
  }

  .legal-page p {
    color: var(--text-muted);
  }

  .legal-page a {
    color: var(--primary);
    font-weight: var(--font-weight-bold);
  }

  @media (min-width: 40rem) {
    .legal-page {
      inline-size: min(calc(100% - 3rem), 54rem);
    }
  }
</style>
