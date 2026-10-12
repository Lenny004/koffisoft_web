<script lang="ts">
  import { resolve } from '$app/paths';

  import { editorialPlaceholder } from '$lib/content/site';
  import {
    legalDocuments,
    type LegalDocument,
    type LegalHref,
    type LegalInline,
  } from '$lib/content/legal';

  let { document } = $props<{ document: LegalDocument }>();

  function isLink(part: LegalInline): part is { text: string; href: LegalHref } {
    return typeof part !== 'string';
  }
</script>

<svelte:head>
  <title>{document.title} | Koffi-Soft</title>
  <meta name="description" content={document.description} />
</svelte:head>

<article class="legal-document">
  {#if editorialPlaceholder}
    <p class="legal-document__notice">Documento provisional pendiente de revisión legal.</p>
  {/if}

  <header class="legal-document__header">
    <h1 class="legal-document__title">{document.title}</h1>
  </header>

  {#each document.sections as section, index (section.id)}
    <section class="legal-document__section" id={section.id} aria-labelledby="{section.id}-title">
      <h2 class="legal-document__heading" id="{section.id}-title">
        {index + 1}.- {section.title}
      </h2>
      {#each section.blocks as block, blockIndex (blockIndex)}
        {#if block.kind === 'facts'}
          <p class="legal-document__facts">
            {#each block.rows as row (row.label)}
              <span class="legal-document__fact">
                <span class="legal-document__label">{row.label}:</span>
                {row.value}
              </span>
            {/each}
          </p>
        {:else if block.kind === 'list'}
          <ul class="legal-document__list">
            {#each block.items as item, itemIndex (itemIndex)}
              <li class="legal-document__item">{item}</li>
            {/each}
          </ul>
        {:else}
          <p class="legal-document__text">
            {#each block.content as part, partIndex (partIndex)}{#if isLink(part)}<a
                  class="legal-document__link"
                  href={resolve(part.href)}>{part.text}</a
                >{:else}{part}{/if}{/each}
          </p>
        {/if}
      {/each}
    </section>
  {/each}

  <nav class="legal-document__nav" aria-label="Documentos legales">
    <ul class="legal-document__index">
      {#each legalDocuments as item (item.href)}
        <li class="legal-document__index-item">
          {#if item.href === document.href}
            <span class="legal-document__index-current" aria-current="page">{item.navLabel}</span>
          {:else}
            <a class="legal-document__index-link" href={resolve(item.href)}>{item.navLabel}</a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</article>

<style>
  /* Documento legal de lectura larga: cláusulas numeradas, ficha del titular y índice entre módulos. */
  .legal-document {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-xl) var(--space-2xl);
  }

  .legal-document__notice {
    margin: 0 0 var(--space-lg);
    padding: var(--space-sm) var(--space-md);
    color: var(--accent-foreground);
    background: var(--accent);
    border-radius: var(--radius-md);
  }

  .legal-document__header {
    margin-block-end: var(--space-xl);
    padding-block-start: var(--space-md);
    border-block-start: 0.25rem solid var(--foreground);
  }

  .legal-document__title {
    margin: var(--space-md) 0 0;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .legal-document__section {
    margin-block-start: var(--space-xl);
  }

  .legal-document__heading {
    margin: 0 0 var(--space-md);
    font-size: clamp(1.15rem, 2vw, 1.5rem);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .legal-document__text,
  .legal-document__facts {
    margin: 0 0 var(--space-md);
    color: var(--foreground);
    line-height: 1.7;
  }

  .legal-document__fact {
    display: block;
  }

  .legal-document__label {
    font-weight: var(--font-weight-bold);
  }

  .legal-document__list {
    margin: 0 0 var(--space-md);
    padding: 0;
    list-style: none;
  }

  .legal-document__item {
    margin-block-end: var(--space-xs);
    color: var(--foreground);
    line-height: 1.7;
  }

  .legal-document__item::before {
    content: '– ';
  }

  .legal-document__link,
  .legal-document__index-link {
    color: var(--primary);
    font-weight: var(--font-weight-bold);
  }

  .legal-document__nav {
    margin-block-start: var(--space-2xl);
    padding-block-start: var(--space-lg);
    border-block-start: 1px solid var(--border);
  }

  .legal-document__index {
    display: grid;
    gap: var(--space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .legal-document__index-link,
  .legal-document__index-current {
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .legal-document__index-current {
    color: var(--foreground);
    font-weight: var(--font-weight-bold);
  }

  @media (min-width: 48rem) {
    .legal-document {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }
  }
</style>
