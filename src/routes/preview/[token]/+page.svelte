<script lang="ts">
  /**
   * Vista previa privada (no indexable) de avisos, platos o eventos obtenidos por token.
   */
  import { CalendarDays, Megaphone, Utensils } from '@lucide/svelte';

  import { Badge } from '$lib/components/ui/badge/index.js';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card/index.js';
  import type { PageData } from './$types';
  import { isSafeAnnouncementCtaUrl } from '$lib/content/announcements';

  let { data }: { data: PageData } = $props();
  const preview = $derived(data.preview);

  /** Devuelve el título de página según el tipo de recurso incluido en la respuesta de preview. */
  function resourceTitle(): string {
    if (preview.resourceType === 'announcement') return 'Vista previa de aviso';
    if (preview.resourceType === 'menu_item') return 'Vista previa de plato';
    return 'Vista previa de evento';
  }

  /** Selecciona el icono de Lucide que representa el tipo de recurso en la cabecera. */
  function resourceIcon() {
    if (preview.resourceType === 'announcement') return Megaphone;
    if (preview.resourceType === 'menu_item') return Utensils;
    return CalendarDays;
  }

  /** Acepta solo URLs de CTA validadas para enlaces externos en la vista previa. */
  function safeCtaUrl(value: unknown): string | null {
    return typeof value === 'string' && isSafeAnnouncementCtaUrl(value) ? value : null;
  }

  const Icon = resourceIcon();
</script>

<svelte:head>
  <title>{resourceTitle()} | Koffi-Soft</title>
  <meta name="robots" content="noindex, nofollow, noarchive" />
</svelte:head>

<main class="mx-auto min-h-screen w-full max-w-3xl px-4 py-12 sm:px-6">
  <Card>
    <CardHeader>
      <div class="mb-2 flex items-center gap-3 text-muted-foreground">
        <Icon class="size-5" aria-hidden="true" />
        <Badge variant="info">Vista previa privada</Badge>
      </div>
      <CardTitle>{resourceTitle()}</CardTitle>
      <CardDescription>Este enlace es temporal y no se indexa en buscadores.</CardDescription>
    </CardHeader>
    <CardContent>
      {#if preview.resourceType === 'announcement'}
        <article class="space-y-4">
          <h1 class="text-3xl font-semibold">{String(preview.resource.title ?? '')}</h1>
          <p class="whitespace-pre-line text-lg leading-8">
            {String(preview.resource.message ?? '')}
          </p>
          {#if preview.resource.ctaLabel && safeCtaUrl(preview.resource.ctaUrl)}
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            <a
              class="inline-flex rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
              href={safeCtaUrl(preview.resource.ctaUrl) ?? ''}
              rel="noopener noreferrer"
              target="_blank">{String(preview.resource.ctaLabel)}</a
            >
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
          {/if}
        </article>
      {:else if preview.resourceType === 'menu_item'}
        <article class="space-y-4">
          <p class="text-sm font-medium uppercase tracking-wide text-muted-foreground">Plato</p>
          <h1 class="text-3xl font-semibold">{String(preview.resource.nameEs ?? '')}</h1>
          <p class="text-lg text-muted-foreground">
            {String(preview.resource.descriptionEs ?? '')}
          </p>
        </article>
      {:else}
        <article class="space-y-4">
          <p class="text-sm font-medium uppercase tracking-wide text-muted-foreground">Evento</p>
          <h1 class="text-3xl font-semibold">{String(preview.resource.title ?? '')}</h1>
          <p class="text-muted-foreground">
            {String(preview.resource.startsAt ?? '')} — {String(preview.resource.endsAt ?? '')}
          </p>
        </article>
      {/if}
    </CardContent>
  </Card>
</main>
