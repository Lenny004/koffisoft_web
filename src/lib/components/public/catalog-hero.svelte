<script lang="ts">
  let {
    title,
    label,
    description,
    titleId,
    level = 'h1',
    imageUrl = null,
  } = $props<{
    title: string;
    label?: string;
    description?: string;
    titleId: string;
    level?: 'h1' | 'h2';
    imageUrl?: string | null;
  }>();
</script>

<section class="catalog-hero" aria-labelledby={titleId}>
  {#if imageUrl}<img class="catalog-hero__image" src={imageUrl} alt="" loading="eager" />{/if}
  <svelte:element this={level} id={titleId} class="catalog-hero__title">{title}</svelte:element>
  {#if label}<p class="catalog-hero__label">{label}</p>{/if}
  {#if description}<p class="catalog-hero__copy">{description}</p>{/if}
</section>

<style>
  /* Introducción editorial: título grande, rótulo en versalitas y un párrafo corto. */
  .catalog-hero {
    display: grid;
    justify-items: center;
    padding-block: clamp(3.5rem, 8vw, 6.5rem);
    text-align: center;
  }

  .catalog-hero__title {
    max-inline-size: 46rem;
    margin: 0;
    font-family: var(--font-family-editorial);
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.12;
    text-wrap: balance;
  }

  .catalog-hero__image {
    inline-size: min(100%, 32rem);
    max-block-size: 16rem;
    object-fit: cover;
    border-radius: var(--radius-lg);
  }

  .catalog-hero__label {
    margin: var(--space-md) 0 0;
    color: var(--text-muted);
    font-size: 0.75rem;
    letter-spacing: var(--letter-spacing-label);
    text-transform: uppercase;
  }

  .catalog-hero__copy {
    max-inline-size: 38rem;
    margin: var(--space-sm) 0 0;
    color: var(--text-muted);
  }
</style>
