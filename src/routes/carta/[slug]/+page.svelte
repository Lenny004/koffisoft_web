<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import ProductDetail from '$lib/components/public/product-detail.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.item?.item.nameEs ?? 'Detalle de la carta'} | Koffi-Soft</title>
  <meta
    name="description"
    content={data.item?.item.descriptionEs ??
      'Detalle de un ítem de la carta pública de Koffi-Soft.'}
  />
</svelte:head>

<div class="menu-detail-page">
  <Button href="/carta" variant="link" class="menu-detail-page__back">
    <ArrowLeft size={16} aria-hidden="true" /> Volver a la carta
  </Button>

  {#if data.errorMessage || !data.item}
    <StatusMessage
      title="Ítem no disponible"
      message={data.errorMessage ?? 'No encontramos este ítem en la carta pública.'}
      variant="destructive"
    />
  {:else}
    <ProductDetail item={data.item.item} category={data.item.category} />
  {/if}
</div>

<style>
  /* La vista conserva el enlace de retorno y delega el detalle visual al componente reutilizable. */
  .menu-detail-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-xl) var(--space-lg);
  }

  :global(.menu-detail-page__back) {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    margin-block-end: var(--space-lg);
    padding-inline: 0;
  }

  @media (min-width: 40rem) {
    .menu-detail-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
      padding-block-start: var(--space-2xl);
    }
  }
</style>
