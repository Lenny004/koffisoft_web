<script lang="ts">
  import { ArrowRight, CalendarDays, Coffee, MapPin } from '@lucide/svelte';

  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent } from '$lib/components/ui/card/index.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Koffi-Soft | Café y paisaje en la Ruta Panorámica</title>
  <meta
    name="description"
    content="Descubre Koffi-Soft, café, cocina y encuentros en la Ruta Panorámica de El Salvador. Consulta la carta, reserva o cotiza tu evento."
  />
</svelte:head>

<div class="home-page">
  <section class="home-hero" aria-labelledby="home-title">
    <div class="home-hero__content">
      <p class="home-hero__eyebrow"><Coffee size={16} aria-hidden="true" /> Koffi-Soft</p>
      <h1 id="home-title" class="home-hero__title">Una pausa con vista a la montaña.</h1>
      <p class="home-hero__copy">
        Café, cocina y momentos para compartir en la Ruta Panorámica de El Salvador. Ven por el
        paisaje, quédate por la mesa.
      </p>
      <div class="home-hero__actions">
        <Button href="/reservas" size="lg" class="home-hero__action">
          Reservar una mesa
          <ArrowRight class="home-hero__icon" size={18} aria-hidden="true" />
        </Button>
        <Button href="/carta" variant="outline" size="lg" class="home-hero__action"
          >Explorar la carta</Button
        >
      </div>
      <div class="home-hero__details">
        <span><MapPin size={16} aria-hidden="true" /> Ruta Panorámica</span>
        <span><CalendarDays size={16} aria-hidden="true" /> Eventos y celebraciones</span>
      </div>
    </div>
    <div class="home-hero__visual" aria-label="Espacio de café con vista panorámica" role="img">
      <div class="home-hero__sun" aria-hidden="true"></div>
      <div class="home-hero__mountain home-hero__mountain--back" aria-hidden="true"></div>
      <div class="home-hero__mountain home-hero__mountain--front" aria-hidden="true"></div>
      <div class="home-hero__cup" aria-hidden="true">☕</div>
      <p class="home-hero__visual-label">El Salvador</p>
    </div>
  </section>

  <section class="home-section home-section--menu" aria-labelledby="featured-title">
    <div class="home-section__heading">
      <div>
        <p class="home-section__eyebrow">Para disfrutar sin prisa</p>
        <h2 id="featured-title" class="home-section__title">Favoritos de la carta</h2>
      </div>
      <Button href="/carta" variant="link" class="home-section__link">
        Ver toda la carta <ArrowRight size={16} aria-hidden="true" />
      </Button>
    </div>

    {#if data.errorMessage}
      <StatusMessage
        title="Carta temporalmente no disponible"
        message={data.errorMessage}
        variant="destructive"
      />
    {:else if data.featuredItems.length === 0}
      <Card class="home-empty">
        <CardContent>
          <p class="home-empty__title">Estamos preparando la carta pública.</p>
          <p class="home-empty__copy">
            Pronto podrás consultar nuestras opciones directamente aquí.
          </p>
        </CardContent>
      </Card>
    {:else}
      <div class="home-section__grid">
        {#each data.featuredItems as featuredItem (featuredItem.item.id)}
          <MenuItemCard
            item={featuredItem.item}
            categoryName={featuredItem.categoryName}
            featured
          />
        {/each}
      </div>
    {/if}
  </section>

  <section class="home-callout" aria-labelledby="home-callout-title">
    <div>
      <p class="home-section__eyebrow home-callout__eyebrow">Momentos que merecen una mesa</p>
      <h2 id="home-callout-title" class="home-callout__title">
        Celebra tu próxima historia con nosotros.
      </h2>
      <p class="home-callout__copy">
        Conoce nuestros espacios y cuéntanos qué necesitas para tu evento.
      </p>
    </div>
    <Button href="/eventos" variant="secondary" size="lg">
      Cotizar un evento <ArrowRight size={18} aria-hidden="true" />
    </Button>
  </section>
</div>

<style>
  /* La portada reúne contenido editorial estático y datos de carta cargados en el servidor. */
  .home-page {
    inline-size: min(100% - 2rem, var(--container-max));
    margin-inline: auto;
  }

  .home-hero {
    display: grid;
    gap: var(--space-xl);
    min-block-size: min(42rem, calc(100dvh - 4.5rem));
    align-items: center;
    padding-block: 3rem;
  }

  .home-hero__content {
    max-inline-size: 38rem;
  }

  .home-hero__eyebrow,
  .home-section__eyebrow {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0 0 var(--space-md);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .home-hero__title,
  .home-section__title,
  .home-callout__title {
    margin: 0;
    font-family: Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .home-hero__title {
    max-inline-size: 11ch;
    font-size: clamp(3rem, 9vw, 6rem);
    line-height: 0.95;
  }

  .home-hero__copy {
    max-inline-size: 34rem;
    margin: var(--space-lg) 0 0;
    color: var(--muted-foreground);
    font-size: clamp(1rem, 2vw, 1.25rem);
  }

  .home-hero__actions,
  .home-hero__details {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm);
  }

  .home-hero__actions {
    margin-block-start: var(--space-xl);
  }

  :global(.home-hero__icon) {
    margin-inline-start: 0.25rem;
  }

  .home-hero__details {
    margin-block-start: var(--space-lg);
    color: var(--muted-foreground);
    font-size: 0.82rem;
  }

  .home-hero__details span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .home-hero__visual {
    position: relative;
    min-block-size: 20rem;
    overflow: hidden;
    border-radius: 2rem;
    background: linear-gradient(150deg, var(--sand-100), var(--sand-300));
    isolation: isolate;
  }

  .home-hero__sun {
    position: absolute;
    inset-block-start: 15%;
    inset-inline-end: 16%;
    inline-size: 5rem;
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    background: var(--accent);
    box-shadow: 0 0 4rem var(--accent);
  }

  .home-hero__mountain {
    position: absolute;
    inset-inline: -10%;
    clip-path: polygon(0 100%, 18% 54%, 34% 75%, 50% 22%, 68% 67%, 81% 45%, 100% 100%);
  }

  .home-hero__mountain--back {
    inset-block-end: 16%;
    block-size: 58%;
    background: color-mix(in oklab, var(--primary) 28%, var(--sand-100));
  }

  .home-hero__mountain--front {
    inset-block-end: -8%;
    block-size: 56%;
    background: var(--coffee-700);
  }

  .home-hero__cup {
    position: absolute;
    inset-block-end: 11%;
    inset-inline-start: 14%;
    display: grid;
    place-items: center;
    inline-size: 5rem;
    block-size: 5rem;
    border-radius: 1.5rem;
    background: var(--card);
    box-shadow: var(--shadow-md);
    font-size: 2.6rem;
    transform: rotate(-8deg);
  }

  .home-hero__visual-label {
    position: absolute;
    inset-block-end: 1.2rem;
    inset-inline-end: 1.4rem;
    margin: 0;
    color: var(--primary-foreground);
    font-family: Georgia, serif;
    font-size: 1.1rem;
    font-style: italic;
  }

  .home-section {
    padding-block: 4rem;
  }

  .home-section__heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-lg);
    margin-block-end: var(--space-xl);
  }

  .home-section__eyebrow {
    margin-block-end: 0.5rem;
  }

  .home-section__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  :global(.home-section__link) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding-inline: 0;
  }

  .home-section__grid {
    display: grid;
    gap: var(--space-lg);
  }

  :global(.home-empty) {
    max-inline-size: 36rem;
  }

  .home-empty__title,
  .home-empty__copy {
    margin: 0;
  }

  .home-empty__title {
    font-weight: 700;
  }

  .home-empty__copy {
    margin-block-start: 0.35rem;
    color: var(--muted-foreground);
  }

  .home-callout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-xl);
    margin-block: 2rem 4rem;
    padding: clamp(1.5rem, 5vw, 3rem);
    border-radius: 1.5rem;
    color: var(--primary-foreground);
    background: var(--primary);
  }

  .home-callout__eyebrow {
    color: var(--accent);
  }

  .home-callout__title {
    max-inline-size: 18ch;
    font-size: clamp(1.8rem, 4vw, 3rem);
  }

  .home-callout__copy {
    max-inline-size: 34rem;
    margin: var(--space-md) 0 0;
    color: color-mix(in oklab, var(--primary-foreground) 80%, transparent);
  }

  @media (min-width: 48rem) {
    .home-page {
      inline-size: min(100% - 3rem, var(--container-max));
    }

    .home-hero {
      grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.85fr);
      gap: clamp(2rem, 8vw, 7rem);
    }

    .home-hero__visual {
      min-block-size: 34rem;
    }

    .home-section__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 35rem) {
    .home-section__heading,
    .home-callout {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
