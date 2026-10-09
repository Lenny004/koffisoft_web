<script lang="ts">
  import { resolve } from '$app/paths';
  import { LockKeyhole } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
</script>

<svelte:head>
  <title>{siteContent.legal.privacyTitle} | Koffi-Soft</title>
  <meta name="description" content="Consulta la política de privacidad de Koffi-Soft." />
</svelte:head>

<div class="privacy-page">
  <SectionHeading level="h1" title={siteContent.legal.privacyTitle} eyebrow="Tus datos importan" />
  <article class="privacy-page__article">
    <div class="privacy-page__icon" aria-hidden="true"><LockKeyhole size={25} /></div>
    {#if editorialPlaceholder}<p class="privacy-page__notice">
        Documento provisional pendiente de revisión legal.
      </p>{/if}
    <h2>Información que recibimos</h2>
    <p>{siteContent.legal.placeholder}</p>
    <h2>Formularios y cookies</h2>
    <p>
      Las solicitudes de reserva, eventos y contacto deben operar con los canales aprobados. No
      almacenamos sesiones o tokens de autenticación en el navegador.
    </p>
    <h2>Consultas</h2>
    <p>Puedes solicitar información adicional desde <a href={resolve('/contacto')}>contacto</a>.</p>
  </article>
</div>

<style>
  /* Página separada para que el enlace de privacidad del footer tenga un destino claro. */
  .privacy-page {
    inline-size: min(calc(100% - 2rem), 54rem);
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .privacy-page__article {
    padding: clamp(var(--space-lg), 5vw, var(--space-2xl));
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .privacy-page__icon {
    display: grid;
    place-items: center;
    inline-size: 3rem;
    block-size: 3rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
  }

  .privacy-page__notice {
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
  }

  .privacy-page h2 {
    margin: var(--space-xl) 0 var(--space-sm);
    font-size: 1.5rem;
  }

  .privacy-page p {
    color: var(--text-muted);
  }

  .privacy-page a {
    color: var(--primary);
    font-weight: var(--font-weight-bold);
  }

  @media (min-width: 40rem) {
    .privacy-page {
      inline-size: min(calc(100% - 3rem), 54rem);
    }
  }
</style>
