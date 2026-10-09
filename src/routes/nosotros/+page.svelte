<script lang="ts">
  import { HeartHandshake, Mountain, Users } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
</script>

<svelte:head>
  <title>Nosotros | Koffi-Soft</title>
  <meta name="description" content="Conoce la misión, visión y equipo de Koffi-Soft." />
</svelte:head>

<div class="about-page">
  <section class="about-page__hero">
    <div>
      <p class="about-page__eyebrow">Una mesa con paisaje</p>
      <h1 class="about-page__title">Nosotros</h1>
      <p class="about-page__intro">
        Koffi-Soft nace como un punto de encuentro para disfrutar la montaña con los cinco sentidos.
      </p>
    </div>
    <div
      class="about-page__hero-art"
      role="img"
      aria-label="Ilustración provisional de una montaña"
    >
      <Mountain class="about-page__hero-icon" size={92} strokeWidth={1.2} aria-hidden="true" />
    </div>
  </section>

  {#if editorialPlaceholder}<p class="about-page__notice">
      Contenido editorial provisional pendiente de validación institucional.
    </p>{/if}

  <section class="about-page__values" aria-label="Misión y visión">
    <article class="about-value">
      <HeartHandshake class="about-value__icon" size={25} aria-hidden="true" />
      <h2>Misión</h2>
      <p>{siteContent.about.mission}</p>
    </article>
    <article class="about-value">
      <Mountain class="about-value__icon" size={25} aria-hidden="true" />
      <h2>Visión</h2>
      <p>{siteContent.about.vision}</p>
    </article>
  </section>

  <section class="about-page__team" aria-labelledby="team-title">
    <SectionHeading level="h2" title="El equipo" eyebrow="Personas detrás de la experiencia" />
    <div class="about-page__team-grid">
      {#each siteContent.about.team as member (member.name)}
        <article class="team-card">
          <div class="team-card__avatar" aria-hidden="true"><Users size={26} /></div>
          <h3>{member.name}</h3>
          <p class="team-card__role">{member.role}</p>
          <p>{member.description}</p>
        </article>
      {/each}
    </div>
  </section>
</div>

<style>
  /* Página institucional sin retratos inventados: los perfiles quedan marcados como provisionales. */
  .about-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-xl) var(--space-2xl);
  }

  .about-page__hero {
    display: grid;
    gap: var(--space-xl);
    align-items: center;
    padding-block: var(--space-xl) var(--space-2xl);
  }

  .about-page__eyebrow {
    margin: 0 0 var(--space-xs);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .about-page__title {
    margin: 0;
    font-size: clamp(3rem, 8vw, 6rem);
  }

  .about-page__intro {
    max-inline-size: 38rem;
    margin: var(--space-lg) 0 0;
    color: var(--text-muted);
    font-size: var(--font-size-lg);
  }

  .about-page__hero-art {
    position: relative;
    display: grid;
    place-items: center;
    overflow: hidden;
    min-block-size: 16rem;
    color: var(--primary);
    background: linear-gradient(145deg, var(--surface-warm), var(--cream-200));
    border-radius: var(--radius-lg);
  }

  .about-page__hero-icon {
    inline-size: 5.75rem;
    block-size: 5.75rem;
  }

  .about-page__hero-art::after {
    position: absolute;
    inset-block-start: 1rem;
    inset-inline-end: 2rem;
    inline-size: 9rem;
    block-size: 9rem;
    content: '';
    background: var(--accent);
    border-radius: var(--radius-full);
    opacity: 0.45;
    transform: rotate(12deg);
  }

  .about-page__hero-icon {
    position: relative;
    z-index: 1;
  }

  .about-page__notice {
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
  }

  .about-page__values,
  .about-page__team-grid {
    display: grid;
    gap: var(--space-lg);
  }

  .about-page__values {
    padding-block: var(--space-xl);
  }

  .about-value,
  .team-card {
    padding: var(--space-xl);
    background: var(--surface-warm);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .about-value__icon {
    color: var(--primary);
  }

  .about-value h2,
  .team-card h3 {
    margin: var(--space-md) 0 var(--space-sm);
    font-size: 1.7rem;
  }

  .about-value p,
  .team-card p {
    margin: 0;
    color: var(--text-muted);
  }

  .about-page__team {
    padding-block-start: var(--space-xl);
  }

  .team-card__avatar {
    display: grid;
    place-items: center;
    inline-size: 3.5rem;
    block-size: 3.5rem;
    color: var(--primary-foreground);
    background: var(--primary);
    border-radius: var(--radius-full);
  }

  .team-card .team-card__role {
    color: var(--primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  @media (min-width: 48rem) {
    .about-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .about-page__hero {
      grid-template-columns: 0.9fr 1.1fr;
    }

    .about-page__values {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .about-page__team-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
