<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowRight } from '@lucide/svelte';

  let { href, title, description, image, imageAlt } = $props<{
    href: string;
    title: string;
    description?: string | null;
    image: string;
    imageAlt: string;
  }>();
</script>

<a class="category-card" href={resolve(href)}>
  <div class="category-card__media">
    <img src={image} alt={imageAlt} loading="lazy" />
  </div>
  <div class="category-card__body">
    <div>
      <h3 class="category-card__title">{title}</h3>
      {#if description}<p class="category-card__description">{description}</p>{/if}
    </div>
    <span class="category-card__link">
      Ver opciones <ArrowRight size={17} aria-hidden="true" />
    </span>
  </div>
</a>

<style>
  /* Tarjeta de categoría: imagen editorial arriba y enlace de navegación explícito. */
  .category-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--card-foreground);
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    text-decoration: none;
    transition:
      transform var(--transition-base),
      box-shadow var(--transition-base);
  }

  .category-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-0.25rem);
  }

  .category-card__media {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--surface-warm);
  }

  .category-card__media img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    transition: transform var(--transition-base);
  }

  .category-card:hover .category-card__media img {
    transform: scale(1.04);
  }

  .category-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-lg);
  }

  .category-card__title {
    margin: 0;
    font-size: 1.45rem;
  }

  .category-card__description {
    margin: var(--space-xs) 0 0;
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .category-card__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }
</style>
