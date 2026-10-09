<script lang="ts">
  import { Footprints, Mountain, Trees } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
</script>

<svelte:head>
  <title>Senderismo | Koffi-Soft</title>
  <meta
    name="description"
    content="Descubre el recorrido de senderismo editorial de Koffi-Soft en la Ruta Panorámica."
  />
</svelte:head>

<div class="hiking-page">
  <SectionHeading
    level="h1"
    title="Senderismo"
    eyebrow="Caminar también es llegar"
    description="Un recorrido por etapas para mirar la montaña con otros ojos."
  />

  {#if editorialPlaceholder}<p class="hiking-page__notice">
      Contenido provisional: dificultad, duración y condiciones de acceso deben confirmarse.
    </p>{/if}

  <div class="hiking-page__timeline">
    {#each siteContent.hikingStages as stage, index (stage.title)}
      <article class="hiking-stage">
        <div class="hiking-stage__marker" aria-hidden="true">
          {#if index === 0}<Footprints size={22} />{:else if index === 1}<Trees
              size={22}
            />{:else}<Mountain size={22} />{/if}
        </div>
        <div class="hiking-stage__content">
          <p class="hiking-stage__number">Etapa {index + 1}</p>
          <h2>{stage.title}</h2>
          <p>{stage.description}</p>
          <img
            src={stage.image}
            alt={'Paisaje provisional de la etapa: ' + stage.title}
            loading="lazy"
          />
        </div>
      </article>
    {/each}
  </div>
</div>

<style>
  /* Recorrido vertical responsive con fotografías editoriales copiadas como provisional del legacy. */
  .hiking-page {
    inline-size: min(calc(100% - 2rem), 64rem);
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .hiking-page__notice {
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
  }

  .hiking-page__timeline {
    position: relative;
    display: grid;
    gap: var(--space-xl);
    margin-block-start: var(--space-2xl);
  }

  .hiking-page__timeline::before {
    position: absolute;
    inset-block: 1rem;
    inset-inline-start: 1.35rem;
    inline-size: 1px;
    content: '';
    background: var(--border);
  }

  .hiking-stage {
    position: relative;
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: var(--space-lg);
  }

  .hiking-stage__marker {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    inline-size: 2.75rem;
    block-size: 2.75rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border: 0.35rem solid var(--background);
    border-radius: var(--radius-full);
  }

  .hiking-stage__content {
    padding: var(--space-lg);
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .hiking-stage__number {
    margin: 0 0 var(--space-xs);
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .hiking-stage h2 {
    margin: 0;
    font-size: 1.9rem;
  }

  .hiking-stage__content > p:not(.hiking-stage__number) {
    margin: var(--space-sm) 0 0;
    color: var(--text-muted);
  }

  .hiking-stage img {
    inline-size: 100%;
    max-block-size: 20rem;
    margin-block-start: var(--space-lg);
    object-fit: cover;
    border-radius: var(--radius-md);
  }

  @media (min-width: 48rem) {
    .hiking-page {
      inline-size: min(calc(100% - 3rem), 68rem);
    }

    .hiking-stage__content {
      padding: var(--space-xl);
    }
  }
</style>
