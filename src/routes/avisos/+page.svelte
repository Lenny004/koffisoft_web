<script lang="ts">
  import { resolve } from '$app/paths';

  import {
    formatAnnouncementDate,
    formatAnnouncementMessage,
    isExternalAnnouncementUrl,
    isSafeAnnouncementCtaUrl,
  } from '$lib/content/announcements';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import type { PageData } from './$types';
  import type { PublicImportantAnnouncement } from '$lib/api/types';

  let { data }: { data: PageData } = $props();

  function noticeDate(announcement: PublicImportantAnnouncement): string | null {
    return formatAnnouncementDate(announcement.startsAt ?? announcement.createdAt);
  }
</script>

<svelte:head>
  <title>Aviso importante | Koffi-Soft</title>
  <meta name="description" content="Consulta los avisos importantes publicados por Koffi-Soft." />
</svelte:head>

<div class="announcements-page">
  <header class="announcements-page__header">
    <h1 class="announcements-page__title">Avisos importantes</h1>
  </header>

  <section class="announcements-page__information" aria-label="Avisos vigentes">
    {#if data.errorMessage}
      <StatusMessage
        title="Avisos no disponibles"
        message={data.errorMessage}
        variant="destructive"
      />
    {:else if data.announcements.length === 0}
      <StatusMessage
        title="No hay avisos vigentes"
        message="Cuando publiquemos un aviso importante, podrás leerlo en esta página."
      />
    {:else}
      <div class="announcements-page__inner">
        {#each data.announcements as announcement (announcement.id)}
          {@const displayDate = noticeDate(announcement)}
          {@const paragraphs = formatAnnouncementMessage(announcement.message)}
          <article class="notice">
            <h2 class="notice__title">{announcement.title}</h2>
            {#if displayDate}
              <p class="notice__date">{displayDate}</p>
            {/if}

            {#each paragraphs as paragraph, paragraphIndex (paragraphIndex)}
              <p class="notice__paragraph">
                {#each paragraph.lines as line, lineIndex (lineIndex)}
                  {#if lineIndex > 0}<br />{/if}
                  {#each line as segment, segmentIndex (segmentIndex)}
                    {#if segment.kind === 'link'}
                      <!-- La dirección sale del texto publicado y puede ser externa; resolve() solo admite rutas internas. -->
                      <!-- eslint-disable svelte/no-navigation-without-resolve -->
                      <a
                        class="notice__link"
                        href={segment.value}
                        rel="noopener noreferrer"
                        target="_blank">{segment.value}</a
                      >
                      <!-- eslint-enable svelte/no-navigation-without-resolve -->
                    {:else}
                      {segment.value}
                    {/if}
                  {/each}
                {/each}
              </p>
            {/each}

            {#if announcement.ctaLabel && announcement.ctaUrl && isSafeAnnouncementCtaUrl(announcement.ctaUrl)}
              <p class="notice__action">
                {#if isExternalAnnouncementUrl(announcement.ctaUrl)}
                  <!-- resolve() rechaza URL absolutas y rutas que no empiezan por /. -->
                  <!-- eslint-disable svelte/no-navigation-without-resolve -->
                  <a
                    class="notice__link"
                    href={announcement.ctaUrl}
                    rel="noopener noreferrer"
                    target="_blank">{announcement.ctaLabel}</a
                  >
                  <!-- eslint-enable svelte/no-navigation-without-resolve -->
                {:else}
                  <a class="notice__link" href={resolve(announcement.ctaUrl as '/')}
                    >{announcement.ctaLabel}</a
                  >
                {/if}
              </p>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  /* Columna editorial amplia, al estilo de un aviso impreso: título, fecha y párrafos. */
  .announcements-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .announcements-page__header {
    margin-block-end: var(--space-xl);
    text-align: center;
  }

  .announcements-page__title {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3.25rem);
  }

  .announcements-page__inner {
    display: grid;
    gap: var(--space-2xl);
  }

  .notice {
    display: grid;
    gap: var(--space-md);
    padding-block-end: var(--space-xl);
    border-block-end: 1px solid var(--border);
  }

  .notice__title {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    line-height: 1.25;
  }

  .notice__date,
  .notice__paragraph,
  .notice__action {
    margin: 0;
    color: var(--foreground);
    font-size: var(--font-size-lg);
    line-height: 1.75;
  }

  .notice__date {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .notice__link {
    color: var(--primary);
    font-weight: var(--font-weight-bold);
    text-underline-offset: 0.18em;
  }

  .notice__link:hover {
    color: var(--foreground);
  }

  .notice__link:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 0.15rem;
  }

  @media (min-width: 48rem) {
    .announcements-page {
      inline-size: min(calc(100% - 3rem), 69.375rem);
    }
  }
</style>
