<script lang="ts">
  let {
    title,
    eyebrow,
    description,
    level = 'h2',
    align = 'center',
  } = $props<{
    title: string;
    eyebrow?: string;
    description?: string;
    level?: 'h1' | 'h2' | 'h3';
    align?: 'center' | 'start';
  }>();
</script>

<div class:section-heading--start={align === 'start'} class="section-heading">
  <div class="section-heading__line" aria-hidden="true"></div>
  <div class="section-heading__content">
    {#if eyebrow}<p class="section-heading__eyebrow">{eyebrow}</p>{/if}
    <svelte:element this={level} class="section-heading__title">{title}</svelte:element>
    {#if description}<p class="section-heading__description">{description}</p>{/if}
  </div>
  <div class="section-heading__line" aria-hidden="true"></div>
</div>

<style>
  /* Encabezado reutilizable inspirado en las líneas editoriales de la portada legacy. */
  .section-heading {
    display: grid;
    grid-template-columns: minmax(2rem, 1fr) auto minmax(2rem, 1fr);
    align-items: center;
    gap: var(--space-md);
    margin-block-end: var(--space-xl);
    text-align: center;
  }

  .section-heading--start {
    grid-template-columns: 0 minmax(0, 1fr);
    text-align: start;
  }

  .section-heading--start .section-heading__line {
    display: none;
  }

  .section-heading__line {
    block-size: 1px;
    background: var(--border);
  }

  .section-heading__content {
    max-inline-size: 42rem;
  }

  .section-heading__eyebrow {
    margin: 0 0 var(--space-xs);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .section-heading__title {
    margin: 0;
    color: var(--foreground);
    font-size: clamp(2rem, 5vw, 3.75rem);
  }

  .section-heading__description {
    margin: var(--space-sm) 0 0;
    color: var(--text-muted);
  }
</style>
