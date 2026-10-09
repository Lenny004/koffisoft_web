<script lang="ts">
  import { ArrowRight, SlidersHorizontal } from '@lucide/svelte';

  import MenuItemCard from '$lib/components/public/menu-item-card.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent } from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Select } from '$lib/components/ui/select/index.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Carta | Koffi-Soft</title>
  <meta
    name="description"
    content="Consulta la carta pública de Koffi-Soft, agrupada por categorías y filtrable por alérgenos."
  />
</svelte:head>

<div class="menu-page">
  <header class="menu-page__header">
    <p class="menu-page__eyebrow">Sabores para compartir</p>
    <h1 class="menu-page__title">Nuestra carta</h1>
    <p class="menu-page__intro">
      Opciones publicadas para disfrutar el café, la cocina y el paisaje. La disponibilidad y los
      precios corresponden a la sede seleccionada.
    </p>
  </header>

  <Card class="menu-filter">
    <CardContent>
      <form class="menu-filter__form" method="GET">
        <div class="menu-filter__heading">
          <SlidersHorizontal size={18} aria-hidden="true" />
          <p class="menu-filter__title">Filtrar la carta</p>
        </div>
        <div class="menu-filter__fields">
          <div class="menu-filter__field">
            <Label for="category">Categoría</Label>
            <Select id="category" name="category" value={data.filters.category}>
              <option value="">Todas las categorías</option>
              {#each data.menu?.categories ?? [] as category (category.id)}
                <option value={category.slug}>{category.nameEs}</option>
              {/each}
            </Select>
          </div>
          <div class="menu-filter__field">
            <Label for="allergen">Alérgeno</Label>
            <Input
              id="allergen"
              name="allergen"
              value={data.filters.allergen}
              placeholder="Ej. GLUTEN"
              maxlength="40"
            />
          </div>
          <Button type="submit" class="menu-filter__submit">Aplicar filtros</Button>
          {#if data.filters.category || data.filters.allergen}
            <Button href="/carta" variant="ghost" class="menu-filter__clear">Limpiar</Button>
          {/if}
        </div>
      </form>
    </CardContent>
  </Card>

  {#if data.errorMessage}
    <StatusMessage title="Carta no disponible" message={data.errorMessage} variant="destructive" />
  {:else if !data.menu || data.menu.categories.length === 0}
    <StatusMessage
      title="Todavía no hay opciones publicadas"
      message="La carta se mostrará aquí cuando la sede tenga ítems visibles para el sitio público."
    />
  {:else}
    <div class="menu-page__categories">
      {#each data.menu.categories as category (category.id)}
        {#if category.items.length > 0}
          <section class="menu-category" aria-labelledby={`category-${category.slug}`}>
            <div class="menu-category__heading">
              <div>
                <p class="menu-category__eyebrow">Categoría</p>
                <h2 id={`category-${category.slug}`} class="menu-category__title">
                  {category.nameEs}
                </h2>
                {#if category.descriptionEs}
                  <p class="menu-category__description">{category.descriptionEs}</p>
                {/if}
              </div>
              <span class="menu-category__count">{category.items.length} opciones</span>
            </div>
            <div class="menu-category__grid">
              {#each category.items as item (item.id)}
                <MenuItemCard {item} categoryName={category.nameEs} />
              {/each}
            </div>
          </section>
        {/if}
      {/each}
    </div>
  {/if}

  <div class="menu-page__back">
    <Button href="/" variant="link"
      ><ArrowRight class="menu-page__back-icon" size={16} aria-hidden="true" /> Volver al inicio</Button
    >
  </div>
</div>

<style>
  /* La carta combina filtros de URL con las categorías que devuelve el contrato público. */
  .menu-page {
    inline-size: min(100% - 2rem, var(--container-max));
    margin-inline: auto;
    padding-block: 3rem 1rem;
  }

  .menu-page__header {
    max-inline-size: 45rem;
    margin-block-end: 2rem;
  }

  .menu-page__eyebrow,
  .menu-category__eyebrow {
    margin: 0 0 0.5rem;
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .menu-page__title,
  .menu-category__title {
    margin: 0;
    font-family: Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .menu-page__title {
    font-size: clamp(2.8rem, 8vw, 5rem);
  }

  .menu-page__intro {
    margin: var(--space-md) 0 0;
    color: var(--muted-foreground);
    font-size: 1.1rem;
  }

  :global(.menu-filter) {
    margin-block-end: 3rem;
  }

  .menu-filter__form {
    display: grid;
    gap: var(--space-lg);
  }

  .menu-filter__heading {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--primary);
    font-weight: 700;
  }

  .menu-filter__heading p {
    margin: 0;
  }

  .menu-filter__fields {
    display: grid;
    gap: var(--space-md);
    align-items: end;
  }

  .menu-filter__field {
    display: grid;
    gap: 0.45rem;
  }

  :global(.menu-filter__submit),
  :global(.menu-filter__clear) {
    inline-size: 100%;
  }

  .menu-page__categories {
    display: grid;
    gap: 4rem;
  }

  .menu-category__heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-lg);
    margin-block-end: var(--space-xl);
  }

  .menu-category__title {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  .menu-category__description {
    max-inline-size: 42rem;
    margin: 0.6rem 0 0;
    color: var(--muted-foreground);
  }

  .menu-category__count {
    flex-shrink: 0;
    color: var(--muted-foreground);
    font-size: 0.85rem;
  }

  .menu-category__grid {
    display: grid;
    gap: var(--space-lg);
  }

  .menu-page__back {
    margin-block: 3rem 1rem;
  }

  :global(.menu-page__back-icon) {
    margin-inline-end: 0.3rem;
    transform: rotate(180deg);
  }

  @media (min-width: 48rem) {
    .menu-page {
      inline-size: min(100% - 3rem, var(--container-max));
      padding-block-start: 5rem;
    }

    .menu-filter__fields {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto;
    }

    :global(.menu-filter__submit),
    :global(.menu-filter__clear) {
      inline-size: auto;
    }

    .menu-category__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
