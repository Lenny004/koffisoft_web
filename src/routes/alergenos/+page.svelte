<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowRight, CircleAlert, RotateCcw } from '@lucide/svelte';

  import AllergenSelector from '$lib/components/public/allergen-selector.svelte';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
  import { Button } from '$lib/components/ui/button/index.js';

  let selected = $state<string[]>([]);

  const allergens = [
    { code: 'GLUTEN', label: 'Gluten' },
    { code: 'MILK', label: 'Leche' },
    { code: 'EGG', label: 'Huevo' },
    { code: 'FISH', label: 'Pescado' },
    { code: 'PEANUT', label: 'Cacahuate' },
    { code: 'TREE_NUT', label: 'Frutos de cáscara' },
    { code: 'SESAME', label: 'Ajonjolí' },
    { code: 'SHELLFISH', label: 'Crustáceos' },
    { code: 'CELERY', label: 'Apio' },
    { code: 'SOY', label: 'Soja' },
    { code: 'MUSTARD', label: 'Mostaza' },
    { code: 'TOMATO', label: 'Tomate' },
  ];
</script>

<svelte:head>
  <title>Alérgenos | Koffi-Soft</title>
  <meta
    name="description"
    content="Selecciona alérgenos para preparar tu consulta de la carta Koffi-Soft."
  />
</svelte:head>

<div class="allergens-page">
  <SectionHeading
    level="h1"
    title="Alérgenos"
    eyebrow="Elige con confianza"
    description="Selecciona uno o varios alérgenos para preparar tu consulta. La información definitiva depende de la publicación de cada producto."
  />

  <section class="allergens-page__panel" aria-labelledby="allergens-selector-title">
    <div class="allergens-page__heading">
      <CircleAlert size={23} aria-hidden="true" />
      <h2 id="allergens-selector-title">¿Qué quieres evitar?</h2>
    </div>
    <AllergenSelector options={allergens} {selected} onChange={(codes) => (selected = codes)} />
    <div class="allergens-page__actions">
      <span aria-live="polite">{selected.length} seleccionados</span>
      {#if selected.length > 0}
        <Button variant="ghost" type="button" onclick={() => (selected = [])}>
          <RotateCcw size={16} aria-hidden="true" /> Limpiar
        </Button>
      {/if}
    </div>
  </section>

  <section class="allergens-page__result" aria-live="polite">
    <h2>Consulta preparada</h2>
    {#if selected.length === 0}
      <p>Selecciona alérgenos para verlos aquí. Después puedes continuar hacia la carta.</p>
    {:else}
      <p>Has seleccionado: <strong>{selected.join(', ')}</strong>.</p>
    {/if}
    <a href={resolve('/carta')}>Continuar a la carta <ArrowRight size={17} aria-hidden="true" /></a>
  </section>
</div>

<style>
  /* La selección múltiple es una interacción local; no simula resultados que la API aún no expone. */
  .allergens-page {
    inline-size: min(calc(100% - 2rem), 64rem);
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .allergens-page__panel {
    padding: clamp(var(--space-lg), 5vw, var(--space-xl));
    background: var(--surface-warm);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .allergens-page__heading {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-block-end: var(--space-lg);
    color: var(--primary);
  }

  .allergens-page__heading h2,
  .allergens-page__result h2 {
    margin: 0;
    font-size: 1.8rem;
  }

  .allergens-page__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    margin-block-start: var(--space-lg);
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .allergens-page__result {
    margin-block-start: var(--space-xl);
    padding: var(--space-xl);
    color: var(--text-on-brand);
    background: var(--surface-brand);
    border-radius: var(--radius-lg);
  }

  .allergens-page__result p {
    margin: var(--space-sm) 0 0;
    color: color-mix(in oklab, var(--text-on-brand) 82%, transparent);
  }

  .allergens-page__result a {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    margin-block-start: var(--space-lg);
    color: var(--text-on-brand);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
  }

  @media (min-width: 40rem) {
    .allergens-page {
      inline-size: min(calc(100% - 3rem), 64rem);
    }
  }
</style>
